import type { createSellerRequestSchema } from '@validators/sellerRequest.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import productModel from '@models/product.model';
import sellerModel from '@models/seller.model';
import sellerRequestModel from '@models/sellerRequest.model';

import { BaseController } from './base.controller';

class SellerRequest extends BaseController {
    createRequest = async (
        req: Request<any, any, z.infer<typeof createSellerRequestSchema>>,
        res: Response
    ): Promise<any> => {
        const { price, productId, stock } = req.body;
        const user = req.user;

        const seller = await sellerModel.findOne({ user: user._id });
        if (!seller) {
            return this.errorResponse(res, 'Seller not found', 404);
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        const existingRequest = await sellerRequestModel.findOne({ seller: seller._id, product: productId });
        if (existingRequest) {
            return this.errorResponse(res, 'Request already exists', 400);
        }

        const newSellerRequest = await sellerRequestModel.create({
            seller: seller._id,
            product: productId,
            price,
            stock,
            status: 'pending',
        });

        return this.successResponse(res, newSellerRequest, 'Request created successfully', 201);
    };

    deleteRequest = async (req: Request, res: Response): Promise<any> => {};

    getAllRequest = async (req: Request, res: Response): Promise<any> => {};

    getRequestById = async (req: Request, res: Response): Promise<any> => {};

    updateRequest = async (req: Request, res: Response): Promise<any> => {};
}

export default new SellerRequest();
