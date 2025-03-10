import { jwtSecretKey } from '@configs/config';
import { verify } from 'jsonwebtoken';

export const verifyToken = (token: string) => {
    try {
        const result: any = verify(token, jwtSecretKey as string);
        return { userId: result.userId };
    } catch (e) {
        return false;
    }
};
