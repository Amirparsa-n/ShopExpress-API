import orderController from '@controllers/order.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { updateOrderSchema } from '@validators/order.validation';
import { Router } from 'express';

const orderRouter = Router();

orderRouter.route('/').get(authGuard, orderController.getAllOrders);

orderRouter
    .route('/:id')
    .patch(authGuard, roleGuard('admin'), V({ body: updateOrderSchema as any }), orderController.updateOrder);

export default orderRouter;
