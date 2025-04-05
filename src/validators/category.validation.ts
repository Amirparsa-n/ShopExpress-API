import { z } from 'zod';

export const categorySchema = z.object({
    title: z.string().max(255).trim(),
    slug: z.string().max(255).trim().toLowerCase(),
    description: z.string().max(255).optional(),
    parent: z.string().nullable().optional(),
    filters: z
        .array(
            z.object({
                name: z.string().trim(),
                slug: z.string().trim().toLowerCase(),
                description: z.string().optional(),
                type: z.enum(['radio', 'checkbox']),
                options: z.array(z.string()).optional(),
                min: z.number().optional(),
                max: z.number().optional(),
            })
        )
        .optional(),
});
