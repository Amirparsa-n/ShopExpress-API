import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import userModel from '@models/user.model';
import banModel from '@models/ban.model';
import cities from '@utils/cities/cities.json';

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

    addAddress = async (req: Request, res: Response): Promise<any> => {
        const user = req.user;
        const { name, postalCode, location, address, cityId } = req.body;

        const currentCity = cities.find((city) => +city.id === +cityId);

        if (!currentCity) {
            return this.errorResponse(res, 'Invalid city', 400);
        }

        const newAddress = await userModel.findByIdAndUpdate(
            user?._id,
            { $push: { addresses: req.body } },
            { new: true }
        );

        return this.successResponse(res, { address: newAddress }, 'New Address added successfully');
    };
}

export default new User();
