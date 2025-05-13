import { Router } from 'express';

import authRouter from './auth.routes';
import cartRouter from './cart.routes';
import categoryRouter from './category.routes';
import commentRouter from './comment.routes';
import locationRouter from './location.routes';
import noteRouter from './note.routes';
import orderRouter from './order.routes';
import productRouter from './product.routes';
import sellerRouter from './seller.routes';
import sellerRequestRouter from './sellerRequest.routes';
import shortLinkRouter from './shortLisk.routes';
import userRoute from './user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRoute);
router.use('/seller', sellerRouter);
router.use('/locations', locationRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/notes', noteRouter);
router.use('/seller-request', sellerRequestRouter);
router.use('/comments', commentRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
// router.use('/checkout', checkoutRouter);

router.use('/short', shortLinkRouter);

export default router;
