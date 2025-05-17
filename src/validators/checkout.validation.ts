import z from 'zod';

export const createCheckoutSchema = z.object({
    shippingAddress: z.object({
        postalCode: z.string(),

        address: z
            .string()
            .min(6, 'Address must be at least 6 characters')
            .max(1000, 'Address cannot exceed 1000 characters'),

        location: z.object({
            lat: z.number().min(-90, 'Latitude must be at least -90').max(90, 'Latitude cannot exceed 90'),
            lng: z.number().min(-180, 'Longitude must be at least -180').max(180, 'Longitude cannot exceed 180'),
        }),

        cityId: z.number().positive('City ID must be a positive number').int('City ID must be an integer'),
    }),
});
