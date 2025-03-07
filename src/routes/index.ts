import { Router } from 'express';
import userRoute from './user.routes';
import authRouter from './auth.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRoute);

export default router;
