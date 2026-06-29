import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '../../generated/prisma/client';
import redisClient from '../lib/redisClient'; // <-- Importação do Redis
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// listando clientes do banco
export const getCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, status } = req.query;
        const hasFilters = name || status;
        const cacheKey = 'customers_list_all';

        // se o cara nao buscou nada especifico, pega do redis
        if (!hasFilters) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                // retornando do cache pra ficar mais rapido
                res.status(200).json(JSON.parse(cachedData));
                return;
            }
        }

        // se tem filtro, busca no postgres
        const where: any = {};
        if (name) where.name = { contains: String(name), mode: 'insensitive' };
        if (status) where.status = String(status).toUpperCase();

        const customers = await prisma.customer.findMany({ where });

        // salvando no cache por 60 seg se for a lista toda
        if (!hasFilters) {
            await redisClient.setEx(cacheKey, 60, JSON.stringify(customers));
        }

        res.status(200).json(customers);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
};

// cadastrando um novo cliente
export const createCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Acesso negado' });
            return;
        }

        const { name, document, email } = req.body;

        const customer = await prisma.customer.create({
            data: { name, document, email, status: 'ATIVO' },
        });

        // limpa o cache pq a lista mudou
        await redisClient.del('customers_list_all');

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
};

// atualizando status do cliente
export const updateCustomerStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Acesso negado' });
            return;
        }

        const { id } = req.params;
        const { status } = req.body;

        const customer = await prisma.customer.update({
            where: { id: String(id) },
            data: { status },
        });

        // limpando cache de novo
        await redisClient.del('customers_list_all');

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
};