import type { addToCartSchema, removeFromCartSchema } from '@validators/cart.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import cartModel from '@models/cart.model';
import productModel from '@models/product.model';

import { BaseController } from './base.controller';

class CartController extends BaseController {
    addToCart = async (req: Request<any, any, z.infer<typeof addToCartSchema>>, res: Response): Promise<any> => {
        const { productId, quantity, sellerId } = req.body;
        const user = req.user;

        const product = await productModel.findById(productId).lean();
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        const seller = product.sellers.find((seller) => seller.seller.toString() === sellerId);
        if (!seller) {
            return this.errorResponse(res, 'Seller not found', 404);
        }

        const cart = await cartModel.findOne({ user: user._id });

        if (!cart) {
            const newCart = await cartModel.create({
                user: user._id,
                items: [
                    {
                        product: productId,
                        seller: sellerId,
                        quantity,
                        priceAtTimeOfAdding: seller.price,
                    },
                ],
            });
            return this.successResponse(res, newCart, 'Product added to cart');
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId && item.seller.toString() === sellerId
        );
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.priceAtTimeOfAdding = seller.price;
        } else {
            cart.items.push({
                product: productId,
                seller: sellerId,
                quantity,
                priceAtTimeOfAdding: seller.price,
            });
        }
        await cart.save();
        return this.successResponse(res, cart, 'Product quantity updated in cart');
    };

    getCart = async (req: Request, res: Response): Promise<any> => {};

    removeFromCart = async (
        req: Request<any, any, z.infer<typeof removeFromCartSchema>>,
        res: Response
    ): Promise<any> => {
        const { productId, sellerId } = req.body;
        const user = req.user;

        const cart = await cartModel.findOne({ user: user._id });
        if (!cart) {
            return this.errorResponse(res, 'Cart not found', 404);
        }

        const productIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId && item.seller.toString() === sellerId
        );
        if (productIndex < 0) {
            return this.errorResponse(res, 'Product not found in cart', 404);
        }

        cart.items.splice(productIndex, 1);
        if (cart.items.length === 0) {
            await cartModel.deleteOne({ user: user._id });
            return this.successResponse(res, null, 'Cart is empty now');
        }
        await cart.save();

        return this.successResponse(res, cart, 'Product removed from cart');
    };
}

export default new CartController();
