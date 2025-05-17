/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-invalid-this */
import type { Model } from 'mongoose';
import type { Cart } from 'src/types/cart.types';

import { model, Schema } from 'mongoose';

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    priceAtTimeOfAdding: {
        type: Number,
        required: true,
    },
});

const cartSchema = new Schema<Cart, Model<Cart>>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

cartSchema.virtual('totalPrice').get(function () {
    return this.items?.reduce((total, item) => {
        const itemTotalPrice = item.priceAtTimeOfAdding * item.quantity;
        return total + itemTotalPrice;
    }, 0);
});

cartSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default model('Cart', cartSchema);
