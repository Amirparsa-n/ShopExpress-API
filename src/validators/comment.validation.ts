import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const createCommentSchema = z.object({
    productId: z
        .string()
        .nonempty('Product ID is required')
        .refine((val) => isValidObjectId(val), {
            message: 'Invalid product ID',
        }),

    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),

    content: z.string().max(1000, 'Comment content cannot exceed 1000 characters'),
});

export const updateCommentSchema = z.object({
    content: z.string().max(1000, 'Comment content cannot exceed 1000 characters').optional(),

    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
});

export const addReplySchema = z.object({
    content: z.string().max(1000, 'Reply content cannot exceed 1000 characters').nonempty('Reply content is required'),
});

export const updateReplySchema = z.object({
    content: z.string().max(1000, 'Reply content cannot exceed 1000 characters').optional(),
});
