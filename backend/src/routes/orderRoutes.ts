import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/ordersController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Aplica a blindagem do Token para todas as rotas de pedidos
router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;