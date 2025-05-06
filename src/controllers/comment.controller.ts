/* eslint-disable perfectionist/sort-classes */
import type { createCommentSchema } from '@validators/comment.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import commentModel from '@models/comment.model';
import productModel from '@models/product.model';
import { isValidObjectId } from 'mongoose';

import { BaseController } from './base.controller';

class CommentController extends BaseController {
    getComments = async (req: Request, res: Response): Promise<any> => {
        const { productId, limit, page } = req.query as { productId: string; limit: string; page: string };

        if (!isValidObjectId(productId)) {
            return this.errorResponse(res, 'Invalid product id');
        }

        const product = await productModel.findById(productId).lean();
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        const comments = await this.handlePagination({
            dataKey: 'comments',
            model: commentModel,
            limit: +limit,
            page: +page,
            query: { product: productId },
            sort: { createdAt: -1 },
            populate: [
                { path: 'user', select: 'phone' },
                { path: 'replies', populate: { path: 'users', select: 'phone' } },
            ],
        });

        return this.successResponse(res, comments);
    };

    createComment = async (
        req: Request<any, any, z.infer<typeof createCommentSchema>>,
        res: Response
    ): Promise<any> => {
        const { rating, content, productId } = req.body;
        const user = req.user;

        const product = await productModel.findById(productId);
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        const newComment = await commentModel.create({
            product: productId,
            user: user._id,
            content,
            rating,
            replies: [],
        });

        return this.successResponse(res, newComment, 'Comment create successfully', 201);
    };
    updateComment = async (req: Request, res: Response): Promise<any> => {};

    deleteComment = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return this.errorResponse(res, 'Invalid comment id');
        }

        const deletedComment = await commentModel.findByIdAndDelete(id);
        if (!deletedComment) {
            return this.errorResponse(res, 'Comment not found', 404);
        }

        return this.successResponse(res, deletedComment, 'Comment deleted successfully');
    };

    // Reply Comment
    createReplyComment = async (req: Request, res: Response): Promise<any> => {};
    updateReplyComment = async (req: Request, res: Response): Promise<any> => {};
    deleteReplyComment = async (req: Request, res: Response): Promise<any> => {};
}

export default new CommentController();
