import { validMimeTypes } from '@configs/uploader';
import { megabytesToBytes } from '@utils/sizeConversion';
import mongoose from 'mongoose';
import { z } from 'zod';

const categoryFiltersSchema = z.object({
    name: z.string().trim(),
    slug: z.string().trim().toLowerCase(),
    description: z.string().optional(),
    type: z.enum(['radio', 'checkbox']),
    options: z.array(z.string()).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
});

export const categorySchema = z.object({
    title: z.string().max(255).trim(),
    slug: z.string().max(255).trim().toLowerCase(),
    description: z.string().max(255).optional(),
    parent: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid ObjectId format',
        })
        .nullable()
        .optional(),
    filters: z.array(categoryFiltersSchema).optional(),
    icon: z
        .instanceof(File)
        .refine((file) => file.size <= megabytesToBytes(2), {
            message: `The image is too large. Please choose an image smaller than 2MB.`,
        })
        .refine((file) => validMimeTypes.image.includes(file.type), {
            message: `Please upload a valid image file (${validMimeTypes.image.join(', ')}).`,
        })
        .nullable()
        .optional(),
});

export const subCategorySchema = z.object({
    title: z.string().trim().max(255),
    slug: z
        .string()
        .trim()
        .regex(
            /^[a-z0-9_-]+$/,
            'Slug can only contain lowercase letters(a-z), numbers(0-9),underscore (_), and hyphens (-)'
        )
        .max(255),
    parent: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId format',
    }),
    description: z.string().trim(),
    filters: z.array(categoryFiltersSchema).optional(),
});
