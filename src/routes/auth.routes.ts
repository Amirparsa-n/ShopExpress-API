import authController from '@controllers/auth.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { sendOtpSchema, verifyOtpSchema } from '@validators/auth.validation';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/sendOTP', V({ body: sendOtpSchema }), authController.sendOTP);
authRouter.post('/verifyOTP', V({ body: verifyOtpSchema }), authController.verifyOTP);
authRouter.get('/getMe', authGuard, authController.getMe);

export default authRouter;
