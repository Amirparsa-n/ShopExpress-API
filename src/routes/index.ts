import { Router } from 'express';

import authRouter from './auth.routes';
import categoryRouter from './category.routes';
import locationRouter from './location.routes';
import sellerRouter from './seller.routes';
import userRoute from './user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRoute);
router.use('/seller', sellerRouter);
router.use('/locations', locationRouter);
router.use('/categories', categoryRouter);

export default router;
