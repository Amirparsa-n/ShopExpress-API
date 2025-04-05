import type { ValidationSchema } from 'fastest-validator';

import Validator from 'fastest-validator';

const v = new Validator();

// * Address Validation

const addressesSchema = (mode: 'post' | 'put'): ValidationSchema => {
    const empty = mode === 'put';

    return {
        name: { type: 'string', max: 255, empty, optional: empty },
        postalCode: { type: 'string', empty, optional: empty },
        location: {
            type: 'object',
            empty,
            optional: empty,
            properties: {
                lat: { type: 'number' },
                lng: { type: 'number' },
            },
        },
        address: { type: 'string', empty, optional: empty },
        cityId: { type: 'string', empty, optional: empty },
    };
};

export const addressValidate = v.compile(addressesSchema('post'));

export const updateAddressValidate = v.compile(addressesSchema('put'));
