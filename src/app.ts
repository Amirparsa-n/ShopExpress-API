import type { Request, Response } from 'express';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import errorHandler from './middlewares/error-handler';
import { headersMiddleware } from './middlewares/headers.middleware';
import { zodErrorHandler } from './middlewares/zodErrorHandler';
import apiRoutes from './routes';

import 'express-async-errors';

export function createApp() {
    const app = express();

    app.use(express.json({ limit: '30mb' }));
    app.use(express.urlencoded({ extended: true, limit: '30mb' }));
    app.use(express.static('public'));
    app.use(compression());
    app.use(helmet());
    app.use(headersMiddleware);
    app.use(cors({ origin: '*' }));
    app.use(morgan('dev'));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 300,
        message: (req: Request, res: Response) => {
            return res.status(429).json({ message: 'Too many requests, please try again later.' });
        },
    });
    app.use(limiter);

    // API Routes
    app.use('/api', apiRoutes);

    // 404 response
    app.all('*', (req: Request, res: Response): any => {
        return res.status(404).json({ message: 'Not Found' });
    });

    app.use(zodErrorHandler);
    app.use(errorHandler);

    return app;
}
