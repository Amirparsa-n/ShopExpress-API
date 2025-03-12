import Validator, { ValidationSchema } from 'fastest-validator';

const v = new Validator();

// * Address Validation

const addressesSchema: ValidationSchema = {
    name: { type: 'string', max: 255, empty: false },
    postalCode: { type: 'string', empty: false },
    location: {
        type: 'object',
        properties: {
            lat: { type: 'number', empty: false },
            lng: { type: 'number', empty: false },
        },
    },
    address: { type: 'string', empty: false },
    cityId: { type: 'string', empty: false },
};

export const addressValidate = v.compile(addressesSchema);
