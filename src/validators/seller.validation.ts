import type { ValidationSchema } from 'fastest-validator';

import Validator from 'fastest-validator';

const v = new Validator();

const verifyOtpSchema: ValidationSchema = {
    name: { type: 'string', empty: false, max: 255 },
    contactDetails: {
        type: 'object',
        empty: false,
        properties: {
            phone: { type: 'string', empty: false, pattern: '((0?9)|(\\+?989))\\d{9}' },
        },
    },
    cityId: { type: 'number', empty: false },
};

export const createSellerValidate = v.compile(verifyOtpSchema);
