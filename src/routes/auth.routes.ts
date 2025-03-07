import { Router } from 'express';
import authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/sendOTP', authController.sendOTP);
authRouter.post('/verifyOTP', authController.verifyOTP);
authRouter.post('/getMe', authController.getMe);

export default authRouter;
