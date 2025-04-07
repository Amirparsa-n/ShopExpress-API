import mongoose from 'mongoose';
import { z } from 'zod';

export const objectIdSchema = z.object({
    id: z.instanceof(mongoose.Schema.ObjectId, { message: 'Invalid id format' }),
});
