import { Router } from 'express';
import { getCustomers, createCustomer, updateCustomerStatus } from '../controllers/customersController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Passa TODAS as rotas de clientes pelo middleware de autenticação primeiro
router.use(authenticate);

// Definição dos endpoints
router.get('/', getCustomers);
router.post('/', createCustomer);
router.patch('/:id/status', updateCustomerStatus);

export default router;