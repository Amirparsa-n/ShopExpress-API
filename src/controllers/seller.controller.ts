import type { Request, Response } from 'express';
import type { Seller } from 'src/types/seller.types';

import sellerModel from '@models/seller.model';
import { validateCityId } from '@services/user.service';

import { BaseController } from './base.controller';

class SellerController extends BaseController {
    create = async (req: Request, res: Response): Promise<any> => {
        const { cityId, contactDetails, name } = req.body as Seller;
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

    deleteSeller = async (req: Request, res: Response): Promise<any> => {
        const user = req.user;
        if (!user) return;

        const existingSeller = await sellerModel.findOne({ user: user._id });

        if (!existingSeller) {
            return this.errorResponse(res, 'Seller not found !!', 400);
        }

        await sellerModel.findByIdAndDelete(existingSeller._id);

        // TODO: Delete all products of this seller
        // TODO: Delete Products from user scoping cart

        return this.successResponse(res, null, 'Seller deleted successfully', 200);
    };

    getSeller = async (req: Request, res: Response): Promise<any> => {
        const user = req.user;
        if (!user) return;

        const seller = await sellerModel.findOne({ user: user._id });
        if (!seller) {
            return this.errorResponse(res, 'Seller not found !!', 400);
        }

        return this.successResponse(res, seller, 'Seller fetched successfully', 200);
    };

    update = async (req: Request, res: Response): Promise<any> => {
        const { cityId, contactDetails, name } = req.body as Seller;
        const user = req.user;
        if (!user) return;

        const existingSeller = await sellerModel.findOne({ user: user._id });
        if (!existingSeller) {
            return this.errorResponse(res, 'Seller not found !!', 400);
        }

        const seller = await sellerModel.findByIdAndUpdate(
            existingSeller._id,
            {
                name,
                contactDetails,
                cityId,
            },
            { new: true }
        );

        return this.successResponse(res, seller, 'Seller updated successfully', 200);
    };
}

export default new SellerController();
