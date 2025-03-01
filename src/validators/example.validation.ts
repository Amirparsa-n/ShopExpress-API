import Validator, { ValidationSchema } from 'fastest-validator';

const v = new Validator();

const exampleSchema: ValidationSchema = {
    title: { type: 'string', min: 3, max: 255, empty: false },
    content: { type: 'string', min: 10, empty: false },
    slug: { type: 'string', min: 3, max: 255, empty: true, optional: true },
    tags: { type: 'array', optional: true, items: { type: 'string' } },
};

export const validateExample = v.compile(exampleSchema);
