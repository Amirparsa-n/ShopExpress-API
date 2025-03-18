import { Router } from 'express';
import authRouter from './auth.routes';
import userRoute from './user.routes';
import sellerRouter from './seller.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRoute);
router.use('/seller', sellerRouter);

export default router;
