import cartController from '@controllers/cart.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { Router } from 'express';

const cartRouter = Router();

cartRouter.route('/').get(authGuard, cartController.getCart);
cartRouter.get('/add', authGuard, cartController.addToCart);
cartRouter.delete('/remove', authGuard, cartController.removeFromCart);

export default cartRouter;
