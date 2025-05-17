/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-invalid-this */
import type { Model } from 'mongoose';
import type { Checkout } from 'src/types/checkout.types';

import { model, Schema } from 'mongoose';

const checkoutItemSchema = new Schema({
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
        min: 1,
        required: true,
    },
    priceAtTimeOfPurchase: {
        type: Number,
        required: true,
    },
});

const checkoutSchema = new Schema<Checkout, Model<Checkout>>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [checkoutItemSchema],
    shippingAddress: {
        postalCode: {
            type: String,
            required: true,
        },
        location: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
        address: {
            type: String,
            required: true,
        },
        cityId: {
            type: Number,
            required: true,
        },
    },
    authority: {
        type: String,
        required: true,
    },

    expireAt: {
        // TTL -> Time To Live
        type: Date,
        required: true,
        default: () => Date.now() + 1000 * 60 * 60, // after 1 hours automatically delete
        // default: () => Date.now() + 1000 * 5,
    },
});

checkoutSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

checkoutSchema.virtual('totalPrice').get(function () {
    return this.items?.reduce((total, item) => {
        return total + item.priceAtTimeOfPurchase * item.quantity;
    }, 0);
});

export default model('Checkout', checkoutSchema);
