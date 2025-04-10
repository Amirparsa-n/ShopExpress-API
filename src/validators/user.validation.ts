import { z } from 'zod';

export const createAddressesSchema = z.object({
    name: z.string().max(255),
    postalCode: z.string(),
    location: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional()
        .nullable(),
    address: z.string(),
    cityId: z.string(),
});

export const updateAddressSchema = z.object({
    name: z.string().max(255).optional().nullable(),
    postalCode: z.string().optional().nullable(),
    location: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional()
        .nullable(),
    address: z.string().optional().nullable(),
    cityId: z.string().optional().nullable(),
});
