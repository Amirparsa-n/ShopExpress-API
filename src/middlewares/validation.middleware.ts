import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

import { ZodError } from 'zod';

interface ValidationSchema {
    body?: AnyZodObject;
    query?: AnyZodObject;
    params?: AnyZodObject;
}

export const V = (schema: ValidationSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query);
            }
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params);
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                next(error);
            } else {
                next(error);
            }
        }
    };
};
