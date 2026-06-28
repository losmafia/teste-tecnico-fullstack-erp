import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 1. Criar Pedido (POST /api/orders)
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { customerId, items } = req.body;

        // Regra 1: Pedido precisa ter pelo menos 1 item
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ error: 'O pedido precisa ter pelo menos 1 item.' });
            return;
        }

        const customer = await prisma.customer.findUnique({
            where: { id: String(customerId) },
        });

        if (!customer) {
            res.status(404).json({ error: 'Cliente não encontrado.' });
            return;
        }

        // Regra 4: Cliente inativo não pode receber pedido
        if (customer.status === 'INATIVO') {
            res.status(400).json({ error: 'Não é permitido criar pedidos para clientes inativos.' });
            return;
        }

        let totalValue = 0;

        // Regras 2, 3 e 5: Valida quantidades, valores unitários e calcula o total no backend
        for (const item of items) {
            if (!item.quantity || item.quantity <= 0) {
                res.status(400).json({ error: 'A quantidade do item deve ser maior que zero.' });
                return;
            }
            if (!item.unitPrice || item.unitPrice <= 0) {
                res.status(400).json({ error: 'O valor unitário deve ser maior que zero.' });
                return;
            }
            totalValue += item.quantity * item.unitPrice;
        }

        // Cria o pedido e os itens simultaneamente
        const order = await prisma.order.create({
            data: {
                customerId: customer.id,
                totalValue,
                status: 'DRAFT',
                items: {
                    create: items.map((item: any) => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitValue: item.unitPrice,
                        subtotal: item.quantity * item.unitPrice,
                    })),
                },
            },
            include: { items: true },
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ error: 'Erro interno ao criar pedido.' });
    }
};

// 2. Listar Todos os Pedidos (GET /api/orders)
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: { select: { name: true, document: true } },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
};

// 3. Buscar Pedido por ID (GET /api/orders/:id)
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: String(id) },
            include: {
                customer: { select: { name: true, document: true, email: true } },
                items: true,
            },
        });

        if (!order) {
            res.status(404).json({ error: 'Pedido não encontrado.' });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o pedido.' });
    }
};