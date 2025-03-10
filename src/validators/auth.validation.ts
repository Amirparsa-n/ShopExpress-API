import { object, string, number, date } from 'yup';
import Validator, { ValidationSchema } from 'fastest-validator';

const v = new Validator();

export const sendOtpValidator = object({
    phone: string().matches(/((0?9)|(\+?989))\d{9}/g),
});

const verifyOtpSchema: ValidationSchema = {
    phone: { type: 'string', empty: false, pattern: '((0?9)|(\\+?989))\\d{9}' },
    otp: { type: 'string', empty: false, pattern: '^[0-9]+$' },
    isSeller: { type: 'boolean', empty: false }
};

export const sendOtpValidate = v.compile(verifyOtpSchema);
