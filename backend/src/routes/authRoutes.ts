import { Router } from 'express';
import { login } from '../controllers/authController';

const router = Router();

// A rota final será /api/auth/login, mas o prefixo definimos no servidor
router.post('/login', login);

export default router;