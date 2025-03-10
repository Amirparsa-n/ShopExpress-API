import { jwtSecretKey } from '@configs/config';
import banModel from '@models/ban.model';
import userModel from '@models/user.model';
import { verifyToken } from '@utils/verifyToken';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const tokenArray = token.split(' ');
    if (tokenArray[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Write [Bearer] at the start at the token' });
    }

    const tokenValue = tokenArray[1];

    const decodeToken = verifyToken(tokenValue);
    if (!decodeToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userModel.findOne({ _id: decodeToken.userId });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBanned = await banModel.findOne({ phone: user.phone });
    if (isBanned) {
        return res.status(403).json({ message: 'You are banned from using this service' });
    }

    req.user = user;

    next();
};
