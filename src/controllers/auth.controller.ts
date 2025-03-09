import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import banModel from '@models/ban.model';
import { generateOtp, getOtpDetails, getOtpRedisPattern } from '@services/auth.service';
import { sendSmsOtp } from '@services/SMSOtp.service';
import { sendOtpValidator } from '@validators/auth.validation';
import redis from '@configs/redis';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '@models/user.model';
import { jwtSecretKey } from '@configs/config';

class Auth extends BaseController {
    sendOTP = async (req: Request<any, any, { phone: string }>, res: Response): Promise<any> => {
        const { phone } = req.body;

        if (!phone) {
            return this.errorResponse(res, 'Phone number is required', 400);
        }

        const isBanned = await banModel.findOne({ phone });

        if (isBanned) {
            return this.errorResponse(res, 'You are banned from using this service', 403);
        }

        await sendOtpValidator.validate(req.body, { abortEarly: false });

        const { expired, remainingTime } = await getOtpDetails(phone);

        if (!expired) {
            return this.successResponse(res, null, `Otp already sent, Please try again after ${remainingTime}`);
        }

        const otp = await generateOtp(phone);
        await sendSmsOtp(phone, otp);

        return this.successResponse(res, null, 'OTP sent successfully');
    };

    verifyOTP = async (req: Request<any, any, { phone: string; otp: string }>, res: Response): Promise<any> => {
        const { phone, otp } = req.body;

        const savesOtp = await redis.get(getOtpRedisPattern(phone));

        if (!savesOtp) {
            return this.errorResponse(res, 'OTP is expired or phone incorrect', 400);
        }

        const otpIsCorrect = await bcrypt.compare(otp, savesOtp);

        if (!otpIsCorrect) {
            return this.errorResponse(res, 'OTP is incorrect', 400);
        }

        const user = await userModel.findOne({ phone });

        if (!user) {
            return this.errorResponse(res, 'User not found', 404);
        }

        redis.del(getOtpRedisPattern(phone));

        const token = jwt.sign({ userId: user.id }, jwtSecretKey as string, { expiresIn: '30d' });

        return this.successResponse(res, { user, token }, 'OTP verified successfully');
    };

    getMe = async (req: Request, res: Response): Promise<any> => {};
}

export default new Auth();
