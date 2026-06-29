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
        // Inicio do codigo de login
        // pegando os dados do front
        const { email, username, password } = req.body;
        const loginIdentifier = username || email;

        // verificando se mandou tudo
        if (!loginIdentifier || !password) {
            res.status(400).json({ error: 'Usuário/Email e senha são obrigatórios' });
            return;
        }

        // procurando o usuario no banco
        const user = await prisma.user.findUnique({
            where: { username: loginIdentifier },
        });

        // checando se a senha bate
        if (!user || user.password !== password) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        // criando o token de acesso
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' } 
        );

        // deu tudo certo, retornando o token
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

// logout do sistema
export const logout = async (req: Request, res: Response): Promise<void> => {
    // O logout real acontece no frontend limpando o localStorage (JWT Stateless)
    res.status(200).json({ message: 'Logout realizado com sucesso' });
};