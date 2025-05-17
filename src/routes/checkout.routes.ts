import checkoutController from '@controllers/checkout.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createCheckoutSchema } from '@validators/checkout.validation';
import { Router } from 'express';

const checkoutRouter = Router();

checkoutRouter.route('/').post(authGuard, V({ body: createCheckoutSchema }), checkoutController.createCheckout);
checkoutRouter.get('/verify', checkoutController.verifyCheckout);

export default checkoutRouter;
