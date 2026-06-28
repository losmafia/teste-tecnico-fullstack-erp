import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 1. Listar Clientes com Filtros (Acesso: ADMIN e OPERADOR)
export const getCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, status } = req.query;

        // Constrói os filtros dinamicamente se o usuário enviar na URL
        const where: any = {};
        if (name) where.name = { contains: String(name), mode: 'insensitive' };
        if (status) where.status = String(status).toUpperCase();

        const customers = await prisma.customer.findMany({ where });

        res.status(200).json(customers);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
};

// 2. Cadastrar Cliente (Acesso: Somente ADMIN)
export const createCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Regra de Negócio: Bloqueia se não for ADMIN
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Acesso negado: Apenas administradores podem cadastrar clientes.' });
            return;
        }

        const { name, document, email } = req.body;

        if (!name || !document || !email) {
            res.status(400).json({ error: 'Nome, documento e email são obrigatórios.' });
            return;
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                document,
                email,
                status: 'ATIVO', // Status inicial padrão
            },
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ error: 'Erro interno ao cadastrar cliente' });
    }
};

// 3. Ativar/Inativar Cliente (Acesso: Somente ADMIN)
export const updateCustomerStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Regra de Negócio: Operador não pode inativar ou ativar clientes
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Acesso negado: Operadores não têm permissão para alterar o status do cliente.' });
            return;
        }

        const { id } = req.params;
        const { status } = req.body;

        if (status !== 'ATIVO' && status !== 'INATIVO') {
            res.status(400).json({ error: 'O status deve ser ATIVO ou INATIVO.' });
            return;
        }

        const customer = await prisma.customer.update({
            where: { id: String(id) }, // Garante que id é do tipo primitivo string
            data: { status },
        });

        res.status(200).json(customer);
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ error: 'Erro ao atualizar o status do cliente' });
    }
};