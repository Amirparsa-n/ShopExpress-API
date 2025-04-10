import type { NextFunction, Request, Response } from 'express';

export const headersMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
};
