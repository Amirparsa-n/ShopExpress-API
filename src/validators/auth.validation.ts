import { z } from 'zod';

export const sendOtpSchema = z.object({
    phone: z.string().regex(/((0?9)|(\+?989))\d{9}/g),
});

export const verifyOtpSchema = z.object({
    phone: z.string().regex(/((0?9)|(\\+?989))\\d{9}/g),
    otp: z.string().regex(/^[0-9]+$/g),
    isSeller: z.boolean(),
});
