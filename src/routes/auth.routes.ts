import authController from '@controllers/auth.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { sendOtpValidate } from '@validators/auth.validation';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/sendOTP', authController.sendOTP);
authRouter.post('/verifyOTP', V(sendOtpValidate), authController.verifyOTP);
authRouter.get('/getMe', authGuard, authController.getMe);

export default authRouter;
