import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// criando um novo pedido
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { customerId, items } = req.body;

        // validando se o pedido tem itens
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

        // cliente inativo nao pode fazer pedido
        if (customer.status === 'INATIVO') {
            res.status(400).json({ error: 'Não é permitido criar pedidos para clientes inativos.' });
            return;
        }

        let totalValue = 0;

        // validando as quantidades e somando o total
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

        // salvando tudo no banco de uma vez
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

// pegando todos os pedidos
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { customerName, status } = req.query;
        const where: any = {};

        // busca pelo nome ignorando case
        if (customerName) {
            where.customer = {
                name: { contains: String(customerName), mode: 'insensitive' }
            };
        }
        
        // busca pelo status exato
        if (status) {
            where.status = String(status).toUpperCase();
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                customer: { select: { name: true, document: true } },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
};

// buscando pedido especifico pelo ID
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

// atualizando o status do pedido
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // so o admin pode fazer isso
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Acesso negado: Apenas administradores podem alterar o status do pedido.' });
            return;
        }

        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['DRAFT', 'CONFIRMED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'Status inválido. Use DRAFT, CONFIRMED ou CANCELLED.' });
            return;
        }

        const order = await prisma.order.update({
            where: { id: String(id) },
            data: { status },
        });

        res.status(200).json(order);
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        res.status(500).json({ error: 'Erro ao atualizar o status do pedido.' });
    }
};

// apagando o pedido
export const deleteOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Acesso negado.' });
            return;
        }

        const { id } = req.params;

        // verificando se o pedido existe
        const order = await prisma.order.findUnique({ where: { id: String(id) } });

        if (!order) {
            res.status(404).json({ error: 'Pedido não encontrado.' });
            return;
        }

        if (order.status !== 'DRAFT') {
            res.status(400).json({ error: 'Apenas pedidos com status DRAFT (Rascunho) podem ser excluídos.' });
            return;
        }

        // apagando os itens primeiro pra nao dar erro de FK
        await prisma.orderItem.deleteMany({ where: { orderId: String(id) } });
        await prisma.order.delete({ where: { id: String(id) } });

        res.status(200).json({ message: 'Pedido excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        res.status(500).json({ error: 'Erro ao excluir o pedido.' });
    }
};