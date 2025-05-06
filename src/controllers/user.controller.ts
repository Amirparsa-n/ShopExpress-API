import type { Request, Response } from 'express';

import banModel from '@models/ban.model';
import userModel from '@models/user.model';
import { validateCityId } from '@services/user.service';

import { BaseController } from './base.controller';

class UserController extends BaseController {
    addAddress = async (req: Request, res: Response): Promise<any> => {
        const user = req.user;
        const { cityId } = req.body;

        if (!validateCityId(cityId)) {
            return this.errorResponse(res, 'Invalid city', 400);
        }

        const newAddress = await userModel.findByIdAndUpdate(
            user?._id,
            { $push: { addresses: req.body } },
            { new: true }
        );

        return this.successResponse(res, { address: newAddress }, 'New Address added successfully');
    };

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

    deleteAddress = async (req: Request, res: Response): Promise<any> => {
        const { addressId } = req.params;

        const user: any = await userModel.findOne({ _id: req.user._id });

        const currentAddress = user?.addresses.id(addressId);

        if (!currentAddress) {
            return this.errorResponse(res, 'Address not found', 404);
        }

        await userModel.updateOne({ _id: req.user._id }, { $pull: { addresses: { _id: addressId } } });

        return this.successResponse(res, null, 'Address deleted successfully');
    };

    getAll = async (
        req: Request<any, any, any, { page: string; limit: string; search: string }>,
        res: Response
    ): Promise<any> => {
        const { page, limit, search } = req.query;

        const searchQuery = search
            ? { $or: [{ name: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }] }
            : {};

        if (limit) {
            const data = await this.handlePagination({
                dataKey: 'users',
                model: userModel,
                query: searchQuery,
                limit: +limit,
                page: +page,
            });
            return this.successResponse(res, data);
        } else {
            const users = await userModel.find(searchQuery);
            return this.successResponse(res, users);
        }
    };

    updateAddress = async (req: Request, res: Response): Promise<any> => {
        const { addressId } = req.params;
        const { name, postalCode, location, address, cityId } = req.body;

        const user = await userModel.findOne({ _id: req.user?._id });

        if (!user) return this.errorResponse(res, 'User not found', 404);

        const currentAddress = user.addresses.find((addr: any) => addr._id.toString() === addressId);

        if (!currentAddress) {
            return this.errorResponse(res, 'Address not found', 404);
        }

        currentAddress.name = name ?? currentAddress.name;
        currentAddress.postalCode = postalCode ?? currentAddress.postalCode;
        currentAddress.location = location ?? currentAddress.location;
        currentAddress.address = address ?? currentAddress.address;
        currentAddress.cityId = cityId ?? currentAddress.cityId;

        if (!validateCityId(currentAddress.cityId)) {
            return this.errorResponse(res, 'Invalid city', 400);
        }

        await user.save();

        return this.successResponse(res, { address: currentAddress }, 'Address updated successfully');
    };
}

export default new UserController();
