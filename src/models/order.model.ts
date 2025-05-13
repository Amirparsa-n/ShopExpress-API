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
    priceAtTimeOfAdding: {
        type: Number,
        required: true,
    },
});

const orderSchema = new Schema({
    userId: {
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
    postTrackingCode: {
        type: String,
    },
    authority: {
        type: String,
        required: true,
    },
});

export default model('Order', orderSchema);
