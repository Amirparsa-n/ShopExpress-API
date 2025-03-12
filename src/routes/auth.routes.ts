import { Router } from 'express';
import authController from '@controllers/auth.controller';
import { V } from '@middlewares/validation.middleware';
import { sendOtpValidate } from '@validators/auth.validation';
import { authGuard } from '@middlewares/authGuard.middleware';

const authRouter = Router();

authRouter.post('/sendOTP', authController.sendOTP);
authRouter.post('/verifyOTP', V(sendOtpValidate), authController.verifyOTP);
authRouter.get('/getMe', authGuard, authController.getMe);

export default authRouter;
