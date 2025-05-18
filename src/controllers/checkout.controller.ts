import type { Request, Response } from 'express';

import cartModel from '@models/cart.model';
import checkoutModel from '@models/checkout.model';
import { createPaymentGateway, verifyPayment } from '@services/PaymentGateway.service';

import { BaseController } from './base.controller';
import orderModel from '@models/order.model';
import productModel from '@models/product.model';

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

        return this.successResponse(res, paymentData, 'Redirecting to payment gateway...');
    };

    verifyCheckout = async (req: Request, res: Response): Promise<any> => {
        const { Authority, Status } = req.query as { Authority: string; Status: 'NOK' | 'OK' };

        const alreadyCreatedOrder = await orderModel.findOne({ authority: Authority });
        if (alreadyCreatedOrder) {
            return this.errorResponse(res, 'Payment already verified !!', 400);
        }

        const checkout = await checkoutModel.findOne({ authority: Authority });
        if (!checkout) {
            return this.errorResponse(res, 'Checkout not found', 404);
        }

        const paymentData = await verifyPayment({ amountInRial: checkout.totalPrice!, authority: Authority });

        if (!paymentData || ![100, 101].includes(paymentData?.code)) {
            return this.errorResponse(res, 'Payment verification failed', 400);
        }

        const newOrder = await orderModel.create({
            user: checkout.user,
            items: checkout.items,
            authority: checkout.authority,
            shippingAddress: checkout.shippingAddress,
        });

        // Decrees stock of products after payment verification
        await Promise.all(
            checkout.items.map(async (item) => {
                const product = await productModel.findById(item.product);
                if (product) {
                    const seller = product.sellers.find(
                        (sellerInfo: any) => sellerInfo.seller.toString() === item.seller.toString()
                    );
                    if (seller) {
                        seller.stock -= item.quantity;
                        await product.save();
                    }
                }
            })
        );

        // Delete checkout and cart after payment verification
        await cartModel.findOneAndUpdate({ user: checkout.user }, { items: [] });
        await checkoutModel.deleteOne({ authority: Authority });

        return this.successResponse(res, newOrder, 'Payment verified successfully');
    };
}

export default new CheckoutController();
