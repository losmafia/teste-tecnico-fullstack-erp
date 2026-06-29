import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/ordersController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Aplica a blindagem do Token para todas as rotas de pedidos
router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;