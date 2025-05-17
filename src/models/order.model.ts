/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-invalid-this */
import { model, Schema } from 'mongoose';

const orderItemSchema = new Schema({
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

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
        default: 'processing',
    },
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
    postTrackingCode: {
        type: String,
    },
    authority: {
        type: String,
        required: true,
    },
});

orderSchema.virtual('totalPrice').get(function () {
    return this.items?.reduce((total, item) => {
        const itemTotalPrice = item.priceAtTimeOfPurchase * item.quantity;
        return total + itemTotalPrice;
    }, 0);
});

export default model('Order', orderSchema);
