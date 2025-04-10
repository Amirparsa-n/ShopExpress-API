import type { Request, Response } from 'express';

import { config } from '@configs/config';
import redis from '@configs/redis';
import banModel from '@models/ban.model';
import userModel from '@models/user.model';
import { generateOtp, getOtpDetails, getOtpRedisPattern } from '@services/auth.service';
import { sendSmsOtp } from '@services/SMSOtp.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { BaseController } from './base.controller';

const jwtSecretKey = config.get('jwtSecretKey');

class AuthController extends BaseController {
    getMe = (req: Request, res: Response) => {
        // #swagger.tags = ['Auth']
        const user = req.user;

        return this.successResponse(res, user);
    };

    sendOTP = async (req: Request<any, any, { phone: string }>, res: Response): Promise<any> => {
        const { phone } = req.body;
        // #swagger.tags = ['Auth']

        if (!phone) {
            return this.errorResponse(res, 'Phone number is required', 400);
        }

        const isBanned = await banModel.findOne({ phone });

        if (isBanned) {
            return this.errorResponse(res, 'You are banned from using this service', 403);
        }

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
        // #swagger.tags = ['Auth']

        const savesOtp = await redis.get(getOtpRedisPattern(phone));

        if (!savesOtp) {
            return this.errorResponse(res, 'OTP is expired or phone incorrect', 400);
        }

        const otpIsCorrect = await bcrypt.compare(otp, savesOtp);

        if (!otpIsCorrect) {
            return this.errorResponse(res, 'OTP is incorrect', 400);
        }

        const user = await userModel.findOne({ phone });

        if (user) {
            await redis.del(getOtpRedisPattern(phone));

            const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '30d' });

            return this.successResponse(res, { user, token }, 'OTP verified successfully');
        }

        // * Register

        const isFirstUser = (await userModel.countDocuments()) === 0;

        const newUser = await userModel.create({
            phone,
            role: isFirstUser ? 'admin' : 'user',
        });

        const token = jwt.sign({ userId: newUser.id }, jwtSecretKey, { expiresIn: '30d' });

        return this.successResponse(res, { user: newUser, token }, 'User register successfully');
    };
}

export default new AuthController();
