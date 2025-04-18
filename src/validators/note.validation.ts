import mongoose from 'mongoose';
import { z } from 'zod';

export const noteSchema = z.object({
    productId: z
        .string()
        .nonempty('Product ID is required')
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid ObjectId format',
        }),
    content: z.string().nonempty('Content is required'),
});
