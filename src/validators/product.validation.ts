import { validMimeTypes } from '@configs/uploader';
import { megabytesToBytes } from '@utils/sizeConversion';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

const sellersSchema = z.object({
    seller: z.string().refine((val) => isValidObjectId(val), {
        message: 'Invalid ObjectId format',
    }),
    price: z.number(),
    stock: z.number(),
});

export const productSchema = z.object({
    images: z.array(
        z
            .instanceof(File)
            .refine((file) => file.size <= megabytesToBytes(2), {
                message: `The image is too large. Please choose an image smaller than 2MB.`,
            })
            .refine((file) => validMimeTypes.image.includes(file.type), {
                message: `Please upload a valid image file (${validMimeTypes.image.join(', ')}).`,
            })
    ),
    sellers: z.array(sellersSchema),
    filterValues: z.record(z.any()),
    customFilters: z.record(z.string()),
    shortIdentifier: z.string().trim(),
});
