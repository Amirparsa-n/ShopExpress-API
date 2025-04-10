import type { NextFunction, Request, Response } from 'express';

import { ZodError } from 'zod';

export interface ZodErrorResponse {
    status: 'error';
    code: 422;
    message: 'Validation Error';
    errors: {
        field: string;
        message: string;
    }[];
}

export const zodErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error.name === 'ZodError' || error instanceof ZodError) {
        const zodError = error as ZodError;
        const formattedErrors: ZodErrorResponse['errors'] = zodError.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        }));

        const response: ZodErrorResponse = {
            status: 'error',
            code: 422,
            message: 'Validation Error',
            errors: formattedErrors,
        };

        return res.status(422).json(response);
    }

    next(error);
};
