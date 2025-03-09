import { Router } from 'express';
import authController from '@controllers/auth.controller';
import { validationMiddleware } from '@middlewares/validation.middleware';
import { sendOtpValidate } from '@validators/auth.validation';

const authRouter = Router();

authRouter.post('/sendOTP', authController.sendOTP);
authRouter.post('/verifyOTP', validationMiddleware(sendOtpValidate), authController.verifyOTP);
authRouter.post('/getMe', authController.getMe);

export default authRouter;
