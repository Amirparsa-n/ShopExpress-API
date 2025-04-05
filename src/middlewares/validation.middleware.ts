import type { NextFunction, Request, Response } from 'express';
import type { AsyncCheckFunction, SyncCheckFunction } from 'fastest-validator';

// validationMiddleware
export const V = (validation: AsyncCheckFunction | SyncCheckFunction) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        const validationResponse: any = validation({
            ...req.body,
            cover: req.file,
        });

        if (validationResponse === true) {
            return next();
        }

        // Transform errors to Ant Design format
        const antdErrors = validationResponse.reduce((acc: any, error: any) => {
            acc[error.field] = [error.message];
            return acc;
        }, {});

        return res.status(422).json({
            errors: antdErrors,
            status: 'error',
        });
    };
};
