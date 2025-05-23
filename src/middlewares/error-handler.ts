import type { NextFunction, Request, Response } from 'express';

// import { log } from '@utils/logger';
import { config } from '@configs/config';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): Response => {
    const isProduction = config.get('isProduction');
    const status = err.status ?? 500;
    console.error('Error:', err);

    // log({
    //     level: 'error',
    //     message: err.message,
    //     errors: err.stack,
    //     user: req.user,
    //     url: req.url,
    //     status,
    // });

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(422).json({
            success: false,
            message: `File to large.`,
        });
    }

    if (err.multerError) {
        return res.status(422).json({
            success: false,
            message: err.message ?? 'Invalid file uploaded.',
            errors: err.errors ?? null,
        });
    }

    if (isProduction) {
        return res.status(status).json({
            success: false,
            message: 'An unexpected error occurred.',
        });
    } else {
        return res.status(status).json({
            success: false,
            message: err.message ?? 'An unexpected error occurred.',
            stack: err.stack,
            errors: err.errors ?? null,
        });
    }
};

export default errorHandler;
