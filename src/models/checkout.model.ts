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

const checkoutSchema = new Schema({
    userId: {
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
        coordinates: {
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
});

export default model('Checkout', checkoutSchema);
