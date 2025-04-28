import type { Request, Response } from 'express';

import productModel from '@models/product.model';

import { BaseController } from './base.controller';

class ShortIdentifier extends BaseController {
    redirectToProduct = async (req: Request, res: Response): Promise<any> => {
        const { shortIdentifier } = req.params;

        const product = await productModel.findOne({ shortIdentifier }).lean();
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        return res.redirect(`/api/products/${product._id}`);
    };
}

export default new ShortIdentifier();
