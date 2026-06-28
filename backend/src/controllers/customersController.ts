import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '../../generated/prisma/client';
import redisClient from '../lib/redisClient'; // <-- Importação do Redis
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 1. Listar Clientes
export const getCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, status } = req.query;
        const hasFilters = name || status;
        const cacheKey = 'customers_list_all';

        // ESTRATÉGIA DE CACHE: Só usamos o Redis se o usuário não enviou filtros de busca
        if (!hasFilters) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                // Se achou no Redis, devolve direto (super rápido!)
                console.log('📦 Retornando clientes do CACHE (Redis)');
                res.status(200).json(JSON.parse(cachedData));
                return;
            }
        }

        console.log('🗄️ Buscando clientes no BANCO DE DADOS (PostgreSQL)');
        const where: any = {};
        if (name) where.name = { contains: String(name), mode: 'insensitive' };
        if (status) where.status = String(status).toUpperCase();

        const customers = await prisma.customer.findMany({ where });

        // Salva no Redis apenas se for a lista completa
        if (!hasFilters) {
            // SETEX: Salva a chave, coloca TTL de 60 segundos e insere os dados
            await redisClient.setEx(cacheKey, 60, JSON.stringify(customers));
        }

        res.status(200).json(customers);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
};

// 2. Cadastrar Cliente
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

        // INVALIDAÇÃO: Deleta o cache porque a lista de clientes mudou
        await redisClient.del('customers_list_all');

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
};

// 3. Atualizar Status
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

        // INVALIDAÇÃO: Deleta o cache porque o status de um cliente mudou
        await redisClient.del('customers_list_all');

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
};