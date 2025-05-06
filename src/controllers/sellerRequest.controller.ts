import type { createSellerRequestSchema, updateSellerRequestSchema } from '@validators/sellerRequest.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import productModel from '@models/product.model';
import sellerModel from '@models/seller.model';
import sellerRequestModel from '@models/sellerRequest.model';
import { isValidObjectId } from 'mongoose';

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

    deleteRequest = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        const user = req.user;

        if (!isValidObjectId(id)) {
            return this.errorResponse(res, 'Invalid request ID', 400);
        }

        const seller = await sellerModel.findOne({ user: user._id });
        if (!seller) {
            return this.errorResponse(res, 'Seller not found', 404);
        }

        const sellerRequest = await sellerRequestModel.findOne({ _id: id });
        if (!sellerRequest) {
            return this.errorResponse(res, 'Request not found', 404);
        }

        if (sellerRequest.seller.toString() !== seller._id.toString()) {
            return this.errorResponse(res, 'You have not access to this request', 403);
        }

        if (sellerRequest.status !== 'pending') {
            return this.errorResponse(res, 'You can only delete pending requests', 400);
        }

        await sellerRequestModel.deleteOne({ _id: id });

        return this.successResponse(res, null, 'Request deleted successfully', 200);
    };

    getAllRequest = async (req: Request, res: Response): Promise<any> => {
        const user = req.user;
        const { page, limit, status = 'pending' } = req.query as { page: string; limit: string; status: string };

        const seller = await sellerModel.findOne({ user: user._id });
        if (!seller) {
            return this.errorResponse(res, 'Seller not found', 404);
        }

        const filters = {
            seller: seller._id,
            status,
        };

        const sellerRequests = await this.handlePagination({
            dataKey: 'request',
            model: sellerRequestModel,
            limit: +limit,
            page: +page,
            query: filters,
            sort: { createdAt: -1 },
        });

        return this.successResponse(res, sellerRequests, 'Requests retrieved successfully', 200);
    };

    updateRequest = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        const { status, adminComment } = req.body as z.infer<typeof updateSellerRequestSchema>;

        const sellerRequest = await sellerRequestModel.findOne({ _id: id });
        if (!sellerRequest) {
            return this.errorResponse(res, 'Request not found', 404);
        }

        if (status === 'reject') {
            sellerRequest.status = 'rejected';
            if (adminComment) {
                sellerRequest.adminComment = adminComment;
            }

            await sellerRequest.save();

            return this.successResponse(res, sellerRequest, 'Seller request rejected');
        } else if (status === 'approve') {
            const product = await productModel.findById(sellerRequest.product);
            if (!product) {
                return this.errorResponse(res, 'Product not found', 404);
            }

            const existingProductSeller = product.sellers.find(
                (seller) => seller.seller.toString() === sellerRequest.seller.toString()
            );

            if (existingProductSeller) {
                return this.errorResponse(res, 'Seller already exists fot this product!');
            }

            await productModel.findByIdAndUpdate(sellerRequest.product, {
                $push: {
                    sellers: {
                        seller: sellerRequest.seller,
                        price: sellerRequest.price,
                        stock: sellerRequest.stock,
                    },
                },
            });

            await sellerRequestModel.findOneAndUpdate({ _id: id }, { status: 'approved' });

            return this.successResponse(res, 'Seller request accepted successfully');
        }
    };
}

export default new SellerRequest();
