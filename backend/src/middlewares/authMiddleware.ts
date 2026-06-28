import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendemos a tipagem padrão do Express para incluir os dados do nosso Token
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // 1. Puxa o cabeçalho de autorização
    const authHeader = req.headers.authorization;

    // 2. Verifica se o token foi enviado no formato correto (Bearer <token>)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token não fornecido ou mal formatado' });
        return;
    }

    // 3. Separa a palavra "Bearer" do token real
    const token = authHeader.split(' ')[1];

    try {
        // 4. Tenta abrir o token com a nossa chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string;
            role: string;
        };

        // 5. Deu certo? Pendura as informações do usuário na requisição e abre a catraca (next)
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};