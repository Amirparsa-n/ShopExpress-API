import type { Request, Response } from 'express';

import { BaseController } from './base.controller';

class CartController extends BaseController {
    getCart = async (req: Request, res: Response): Promise<any> => {};

    addToCart = async (req: Request, res: Response): Promise<any> => {};

    removeFromCart = async (req: Request, res: Response): Promise<any> => {};
}

export default new CartController();
