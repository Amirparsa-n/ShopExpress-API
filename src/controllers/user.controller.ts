import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import userModel from '@models/user.model';
import banModel from '@models/ban.model';

class User extends BaseController {
    banUser = async (req: Request, res: Response): Promise<any> => {
        const { userId } = req.params;

        const user = await userModel.findById(userId);

        if (!user) {
            return this.errorResponse(res, 'User not found', 404);
        }

        if (user.role === 'admin') {
            return this.errorResponse(res, 'Admin cannot be banned', 403);
        }

        const banedUser = await banModel.create({ phone: user.phone });

        return this.successResponse(res, banedUser, 'User banned successfully');
    };
}

export default new User();
