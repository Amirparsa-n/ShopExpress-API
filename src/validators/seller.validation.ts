import { z } from 'zod';

export const createSellerSchema = z.object({
    name: z.string().min(1).max(255),
    contactDetails: z.object({
        phone: z.string().regex(/^((0?9)|(\+?989))\d{9}$/),
    }),
    cityId: z.number().int().positive(),
});
