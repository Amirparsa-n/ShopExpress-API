import checkoutController from '@controllers/checkout.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { Router } from 'express';

const checkoutRouter = Router();

checkoutRouter.route('/').post(authGuard, checkoutController.createCheckout);
checkoutRouter.get('/verify', checkoutController.verifyCheckout);

export default checkoutRouter;
