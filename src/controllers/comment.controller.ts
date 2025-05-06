/* eslint-disable perfectionist/sort-classes */
import type { createCommentSchema } from '@validators/comment.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import commentModel from '@models/comment.model';
import productModel from '@models/product.model';

import { BaseController } from './base.controller';
import { isValidObjectId } from 'mongoose';

class CommentController extends BaseController {
    getComments = async (req: Request, res: Response): Promise<any> => {};

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
