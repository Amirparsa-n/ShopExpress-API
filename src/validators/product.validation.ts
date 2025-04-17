import { validMimeTypes } from '@configs/uploader';
import { megabytesToBytes } from '@utils/sizeConversion';
import mongoose, { isValidObjectId } from 'mongoose';
import { z } from 'zod';

const sellersSchema = z.object({
    id: z.string().refine((val) => isValidObjectId(val), {
        message: 'Invalid ObjectId format',
    }),
    price: z.number(),
    stock: z.number().min(0),
});

export const productSchema = z.object({
    name: z.string().trim().max(100),
    slug: z.string().trim(),
    description: z.string().max(1000),
    subCategory: z
        .string({ message: 'SubCategory ID is required' })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid ObjectId format',
        }),
    // images: z.array(
    //     z
    //         .instanceof(File)
    //         .refine((file) => file.size <= megabytesToBytes(2), {
    //             message: `The image is too large. Please choose an image smaller than 2MB.`,
    //         })
    //         .refine((file) => validMimeTypes.image.includes(file.type), {
    //             message: `Please upload a valid image file (${validMimeTypes.image.join(', ')}).`,
    //         })
    // ),
    sellers: z
        .string()
        .transform((val) => (val ? JSON.parse(val) : null))
        .pipe(z.array(sellersSchema).min(1)),
    filterValues: z
        .string()
        .transform((val) => JSON.parse(val))
        .pipe(z.object({}).passthrough()),
    customFilters: z
        .string()
        .transform((val) => JSON.parse(val))
        .pipe(z.object({}).passthrough()),
});
