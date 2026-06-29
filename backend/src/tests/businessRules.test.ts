import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

describe('Business Rules Tests', () => {
    let adminToken: string;
    let operatorToken: string;
    let inactiveCustomerId: string;
    let activeCustomerId: string;

    beforeAll(async () => {
        // Autenticando com perfil admin
        const adminRes = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: '123'
        });
        adminToken = adminRes.body.token;

        // Autenticando com perfil operador
        const operatorRes = await request(app).post('/api/auth/login').send({
            username: 'operador',
            password: '123'
        });
        operatorToken = operatorRes.body.token;

        // Criando cliente inativo e cliente ativo para os testes
        const inactiveCustomer = await prisma.customer.create({
            data: {
                name: 'Cliente Inativo Teste',
                document: '00000000001',
                email: 'inativo@teste.com',
                status: 'INATIVO'
            }
        });
        inactiveCustomerId = inactiveCustomer.id;

        const activeCustomer = await prisma.customer.create({
            data: {
                name: 'Cliente Ativo Teste',
                document: '00000000002',
                email: 'ativo@teste.com',
                status: 'ATIVO'
            }
        });
        activeCustomerId = activeCustomer.id;
    });

    afterAll(async () => {
        // Limpeza dos dados após os testes
        await prisma.customer.deleteMany({
            where: {
                id: { in: [inactiveCustomerId, activeCustomerId] }
            }
        });
        await prisma.$disconnect();
    });

    it('Regra 1: Não permitir pedido para cliente inativo', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                customerId: inactiveCustomerId,
                items: [{ description: 'Item 1', quantity: 1, unitPrice: 10 }]
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('clientes inativos');
    });

    it('Regra 2: Não permitir pedido sem itens', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                customerId: activeCustomerId,
                items: []
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('pelo menos 1 item');
    });

    it('Regra 3: Não permitir item com quantidade zero', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                customerId: activeCustomerId,
                items: [{ description: 'Item 1', quantity: 0, unitPrice: 10 }]
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('quantidade do item deve ser maior que zero');
    });

    it('Regra 4: Não permitir ativar ou inativar cliente usando usuário operador', async () => {
        const res = await request(app)
            .patch(`/api/customers/${activeCustomerId}/status`)
            .set('Authorization', `Bearer ${operatorToken}`)
            .send({
                status: 'INATIVO'
            });

        expect(res.status).toBe(403);
        expect(res.body.error).toContain('Acesso negado');
    });
});
