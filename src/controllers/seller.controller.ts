import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ISeller } from 'src/types/seller.types';
import sellerModel from '@models/seller.model';
import { validateCityId } from '@services/user.service';

class Seller extends BaseController {
    create = async (req: Request, res: Response): Promise<any> => {
        const { cityId, contactDetails, name } = req.body as ISeller;
        const user = req.user;
        if (!user) return;

        const existingSeller = await sellerModel.findOne({ user: user._id });
        if (existingSeller) {
            return this.errorResponse(res, 'You already have a seller account', 400);
        }

        if (!validateCityId(cityId)) {
            return this.errorResponse(res, 'Invalid city', 400);
        }

        const seller = await sellerModel.create({ name, contactDetails, cityId, user: user._id });

        return this.successResponse(res, seller, 'Seller created successfully', 201);
    };
}

export default new Seller();
