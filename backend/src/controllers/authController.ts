import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Recebe os dados do corpo da requisição (pode vir como email ou username)
        const { email, username, password } = req.body;
        const loginIdentifier = username || email;

        // 2. Valida se os campos foram enviados
        if (!loginIdentifier || !password) {
            res.status(400).json({ error: 'Usuário/Email e senha são obrigatórios' });
            return;
        }

        // 3. Busca o usuário no banco de dados mapeando para username
        const user = await prisma.user.findUnique({
            where: { username: loginIdentifier },
        });

        // 4. Validação da senha (simples, comparando texto puro conforme o seed)
        if (!user || user.password !== password) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        // 5. Gera o Token JWT contendo o ID e a role (admin ou operador)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' } // Expira em 1 dia
        );

        // 6. Retorna o token e os dados básicos do usuário
        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};