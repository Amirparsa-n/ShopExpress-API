import { z } from 'zod';

export const updateOrderSchema = z
    .object({
        status: z
            .string()
            .nonempty('Status is required')
            .refine((val) => ['cancelled', 'delivered', 'processing', 'shipped'].includes(val), {
                message: 'Invalid status value (cancelled, delivered, processing, shipped)',
            }),
        postTrackingCode: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.status === 'delivered') {
                return !!data.postTrackingCode;
            }
            return true;
        },
        {
            message: 'Post tracking code is required when status is delivered',
            path: ['postTrackingCode'],
        }
    );
