import cartController from '@controllers/cart.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { addToCartSchema, removeFromCartSchema } from '@validators/cart.validation';
import { Router } from 'express';

const cartRouter = Router();

cartRouter.route('/').get(authGuard, cartController.getCart);
cartRouter.get('/add', authGuard, V({ body: addToCartSchema }), cartController.addToCart);
cartRouter.post('/remove', authGuard, V({ body: removeFromCartSchema }), cartController.removeFromCart);

export default cartRouter;
