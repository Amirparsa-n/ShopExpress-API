import type { ValidationSchema } from 'fastest-validator';

import Validator from 'fastest-validator';

const v = new Validator();

const categorySchema: ValidationSchema = {
    title: { type: 'string', empty: false, trim: true, maxLength: 255 },
    slug: { type: 'string', empty: false, trim: true, lowercase: true, maxLength: 255 },
    description: { type: 'string', optional: true, maxLength: 255 },
    parent: { type: 'string', optional: true, nullable: true },
    filters: {
        type: 'array',
        optional: true,
        items: {
            type: 'object',
            props: {
                name: { type: 'string', empty: false, trim: true },
                slug: { type: 'string', empty: false, trim: true, lowercase: true },
                description: { type: 'string', optional: true },
                type: { type: 'string', enum: ['radio', 'checkbox'] },
                options: { type: 'array', items: 'string', optional: true },
                min: { type: 'number', optional: true },
                max: { type: 'number', optional: true },
            },
        },
    },
};

export const createCategoryValidate = v.compile(categorySchema);
