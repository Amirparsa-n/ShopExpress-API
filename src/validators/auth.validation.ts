import type { ValidationSchema } from 'fastest-validator';

import Validator from 'fastest-validator';
import { object, string } from 'yup';

const v = new Validator();

export const sendOtpValidator = object({
    phone: string().matches(/((0?9)|(\+?989))\d{9}/g),
});

const verifyOtpSchema: ValidationSchema = {
    phone: { type: 'string', empty: false, pattern: '((0?9)|(\\+?989))\\d{9}' },
    otp: { type: 'string', empty: false, pattern: '^[0-9]+$' },
    isSeller: { type: 'boolean', empty: false },
};

export const sendOtpValidate = v.compile(verifyOtpSchema);
