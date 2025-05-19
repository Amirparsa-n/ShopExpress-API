/* eslint-disable perfectionist/sort-classes */
import type {
    addReplySchema,
    createCommentSchema,
    updateCommentSchema,
    updateReplySchema,
} from '@validators/comment.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import commentModel from '@models/comment.model';
import productModel from '@models/product.model';
import { isValidObjectId } from 'mongoose';

import { BaseController } from './base.controller';

class CommentController extends BaseController {
    getAllComments = async (req: Request, res: Response): Promise<any> => {
        const { limit, page } = req.query as { limit: string; page: string };

        const comments = await this.handlePagination({
            dataKey: 'comments',
            model: commentModel,
            limit: +limit,
            page: +page,
            sort: { createdAt: -1 },
            populate: [
                'product',
                { path: 'user', select: 'phone _id role' },
                { path: 'replies', populate: { path: 'user', select: 'phone _id role' } },
            ],
        });

        return this.successResponse(res, comments);
    };

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
                { path: 'replies', populate: { path: 'user', select: 'phone' } },
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

    updateComment = async (
        req: Request<any, any, z.infer<typeof updateCommentSchema>>,
        res: Response
    ): Promise<any> => {
        const { id } = req.params;
        const { content, rating } = req.body;
        const user = req.user;

        const comment = await commentModel.findById(id);
        if (!comment) {
            return this.errorResponse(res, 'Comment not found', 404);
        }

        if (comment.user.toString() !== user._id.toString()) {
            return this.errorResponse(res, 'You have not access to this action');
        }

        const updatedComment = await commentModel.findByIdAndUpdate(id, { content, rating }, { new: true });

        return this.successResponse(res, updatedComment, 'Comment updated successfully');
    };

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

    // * Reply Comment -------------------------------------------------

    createReplyComment = async (
        req: Request<any, any, z.infer<typeof addReplySchema>>,
        res: Response
    ): Promise<any> => {
        const { commentId } = req.params;
        const { content } = req.body;
        const user = req.user;

        const comment = await commentModel.findByIdAndUpdate(
            commentId,
            {
                $push: {
                    replies: {
                        user: user._id,
                        content,
                    },
                },
            },
            { new: true }
        );
        if (!comment) {
            return this.errorResponse(res, 'Comment not found', 404);
        }

        return this.successResponse(res, comment, 'Create reply comment successfully');
    };

    updateReplyComment = async (
        req: Request<{ commentId: string; replyId: string }, any, z.infer<typeof updateReplySchema>>,
        res: Response
    ): Promise<any> => {
        const { commentId, replyId } = req.params;
        const { content } = req.body;
        const user = req.user;

        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return this.errorResponse(res, 'Comment not found', 404);
        }

        const reply = comment.replies.find((reply) => reply._id.toString() === replyId);
        if (!reply) {
            return this.errorResponse(res, 'Reply comment not found', 404);
        }

        if (reply.user.toString() !== user._id.toString()) {
            return this.errorResponse(res, 'You have not access to this action');
        }

        await commentModel.updateOne(
            { _id: commentId },
            { $set: { 'replies.$[reply].content': content } },
            { arrayFilters: [{ 'reply._id': replyId }] }
        );

        return this.successResponse(res, null, 'Reply comment updated successfully');
    };

    deleteReplyComment = async (req: Request, res: Response): Promise<any> => {
        const { commentId, replyId } = req.params;
        const user = req.user;

        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return this.errorResponse(res, 'Comment not found', 404);
        }

        const reply = comment.replies.find((reply) => reply._id.toString() === replyId);
        if (!reply) {
            return this.errorResponse(res, 'Reply comment not found', 404);
        }

        if (reply.user.toString() !== user._id.toString()) {
            return this.errorResponse(res, 'You have not access to this action');
        }

        await commentModel.updateOne({ _id: commentId }, { $pull: { replies: { _id: replyId } } });

        return this.successResponse(res, null, 'Reply comment deleted successfully');
    };
}

export default new CommentController();
