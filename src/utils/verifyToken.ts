import { config } from '@configs/config';
import { verify } from 'jsonwebtoken';

export const verifyToken = (token: string) => {
    try {
        const result: any = verify(token, config.get('jwtSecretKey'));
        return { userId: result.userId };
    } catch {
        return false;
    }
};
