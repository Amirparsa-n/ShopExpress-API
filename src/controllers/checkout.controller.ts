import type { Request, Response } from 'express';

import { createPaymentGateway } from '@services/PaymentGateway.service';

import { BaseController } from './base.controller';

class CheckoutController extends BaseController {
    createCheckout = async (req: Request, res: Response): Promise<any> => {
        const paymentData = await createPaymentGateway({
            amountInRial: 100000,
            description: 'Test payment',
            mobile: '09123456789',
        });

        return this.successResponse(res, paymentData, 'Redirecting to payment gateway...');
    };

    verifyCheckout = async (req: Request, res: Response): Promise<any> => {};
}

export default new CheckoutController();
