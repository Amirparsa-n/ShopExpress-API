import { Router } from 'express';
import authRouter from './auth.routes';
import userRoute from './user.routes';
import sellerRouter from './seller.routes';
import locationRouter from './location.routes';
import categoryRouter from './category.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRoute);
router.use('/seller', sellerRouter);
router.use('/locations', locationRouter);
router.use('/category', categoryRouter);

export default router;
