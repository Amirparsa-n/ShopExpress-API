import mongoose from 'mongoose';
import { z } from 'zod';

export const objectIdSchema = z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid id format',
    }),
});
