import type { NextFunction, Request, Response } from 'express';
import type { Role } from 'src/types/user.types';

export const roleGuard = (role: Role | Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let hasAccessRole = false;

        if (Array.isArray(role)) {
            hasAccessRole = role.some((role) => req.user.role === role);
        } else {
            hasAccessRole = req.user.role === role;
        }

        if (!hasAccessRole) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};
