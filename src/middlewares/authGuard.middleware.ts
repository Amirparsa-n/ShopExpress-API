import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('authGuard', { session: false }, (err: any, user: any, info: any) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    })(req, res, next);
};
