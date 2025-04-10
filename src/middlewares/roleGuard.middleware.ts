import type { NextFunction, Request, Response } from 'express';
import type { Role } from 'src/types/user.types';

export const roleGuard = (role: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
