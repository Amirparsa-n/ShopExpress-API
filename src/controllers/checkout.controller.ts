import type { Request, Response } from 'express';

import cartModel from '@models/cart.model';
import checkoutModel from '@models/checkout.model';
import { createPaymentGateway } from '@services/PaymentGateway.service';

import { BaseController } from './base.controller';

class CheckoutController extends BaseController {
    createCheckout = async (req: Request, res: Response): Promise<any> => {
        const { shippingAddress } = req.body;
        const user = req.user;

        const cart = await cartModel.findOne({ user: user._id }).populate('items.product').populate('items.seller');
        if (!cart?.items?.length) {
            return this.errorResponse(res, 'Cart not found or empty', 400);
        }

        const sellerDetails = cart.items.map((item) => {
            return item.product?.sellers?.find(
                (sellerInfo: any) => sellerInfo.seller?.toString() === item.seller?._id?.toString()
            );
        });
        if (!sellerDetails.length) {
            return this.errorResponse(res, 'Seller dose not sell this product', 400);
        }

        const checkoutItems = cart.items.map((item) => ({
            product: item.product._id,
            seller: item.seller._id,
            quantity: item.quantity,
            priceAtTimeOfPurchase: sellerDetails[0].price,
        }));

        const newCheckout = new checkoutModel({
            user: user._id,
            items: checkoutItems,
            shippingAddress,
        });

        const paymentData = await createPaymentGateway({
            amountInRial: newCheckout.totalPrice!,
            description: 'Test payment',
            mobile: '09123456789',
        });

        newCheckout.authority = paymentData.authority;
        await newCheckout.save();

        // await cartModel.deleteOne({ user: user._id });

        return this.successResponse(res, paymentData, 'Redirecting to payment gateway...');
    };

    verifyCheckout = async (req: Request, res: Response): Promise<any> => {};
}

export default new CheckoutController();
