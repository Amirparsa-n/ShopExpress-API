import { NextFunction, Request, Response } from 'express';
import { AsyncCheckFunction, SyncCheckFunction } from 'fastest-validator';

export const validationMiddleware = (validation: SyncCheckFunction | AsyncCheckFunction) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        const validationResponse = validation({
            ...req.body,
            cover: req.file,
        });

        if (validationResponse === true) {
            return next();
        }

        return res.status(422).json(validationResponse);
    };
};
