import mongoose from 'mongoose';
import { z } from 'zod';

export const objectIdSchema = (idField: string | string[] = 'id') => {
    if (Array.isArray(idField)) {
        const schema: Record<string, z.ZodType> = {};
        idField.forEach((field) => {
            schema[field] = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: `Invalid ${field} format`,
            });
        });
        return z.object(schema);
    }

    return z.object({
        [idField]: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: `Invalid ${idField} format`,
        }),
    });
};
