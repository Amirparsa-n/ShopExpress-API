import type { Request, Response } from 'express';

import { BaseController } from './base.controller';

class OrderController extends BaseController {
    getAllOrders = async (req: Request, res: Response): Promise<any> => {};

    updateOrder = async (req: Request, res: Response): Promise<any> => {};
}

export default new OrderController();
