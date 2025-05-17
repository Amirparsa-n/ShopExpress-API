import type { Request, Response } from 'express';

import { BaseController } from './base.controller';

class CheckoutController extends BaseController {
    createCheckout = async (req: Request, res: Response): Promise<any> => {};

    verifyCheckout = async (req: Request, res: Response): Promise<any> => {};
}

export default new CheckoutController();
