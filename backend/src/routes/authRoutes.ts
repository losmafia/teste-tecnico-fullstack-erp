import { Router } from 'express';
import { login, logout } from '../controllers/authController';

const router = Router();

// A rota final será /api/auth/login, mas o prefixo definimos no servidor
router.post('/login', login);
router.post('/logout', logout); // Endpoint obrigatório pelo teste

export default router;