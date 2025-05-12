import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

// Common schema for reusability
const mongoIdSchema = (fieldName: string) =>
    z
        .string()
        .min(1, `${fieldName} is required`)
        .refine((val) => isValidObjectId(val), {
            message: `Invalid ${fieldName.toLowerCase()}`,
        });

export const addToCartSchema = z.object({
    productId: mongoIdSchema('Product ID'),
    sellerId: mongoIdSchema('Seller ID'),
    quantity: z
        .number()
        .int('Quantity must be an integer')
        .positive('Quantity must be positive')
        .min(1, 'Quantity is required'),
});

export const removeFromCartSchema = z.object({
    productId: mongoIdSchema('Product ID'),
    sellerId: mongoIdSchema('Seller ID'),
});
