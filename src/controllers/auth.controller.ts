import { Request, Response } from 'express';
import banModel from '../models/ban.model';
import { generateOtp, getOtpDetails } from '../services/auth.service';
import { sendSmsOtp } from '../services/SMSOtp.service';
import { BaseController } from './base.controller';

class Auth extends BaseController {
    sendOTP = async (req: Request, res: Response): Promise<any> => {
        const { phone } = req.body;

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

    verifyOTP = async (req: Request, res: Response): Promise<any> => {};

    getMe = async (req: Request, res: Response): Promise<any> => {};
}

export default new Auth();
