import mongoose from 'mongoose';

const sellerRequestSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        adminComment: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

export default mongoose.model('SellerRequest', sellerRequestSchema);
