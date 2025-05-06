import mongoose from 'mongoose';
import z from 'zod';

const isValidObjectId = (value: any) => mongoose.Types.ObjectId.isValid(value);

export const createSellerRequestSchema = z.object({
    productId: z
        .string()
        .nonempty('Product ID is required')
        .refine(isValidObjectId, { message: 'Product ID must be a valid ObjectId' }),

    price: z.number().positive('Price must be a positive number').min(1, 'Price must be at least 1'),

    stock: z.number().int('Stock must be an integer').min(1, 'Stock must be at least 1'),
});

export const updateSellerRequestSchema = z.object({
    status: z
        .string()
        .nonempty('Status is required')
        .refine((val) => ['approve', 'reject'].includes(val), {
            message: 'Status must be either "approve" or "reject"',
        }),

    adminComment: z.string().max(1000, 'Comment cannot exceed 1000 characters').optional(),
});
