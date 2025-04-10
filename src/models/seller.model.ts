import type { Model } from 'mongoose';
import type { Seller } from 'src/types/seller.types';

import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema<Seller, Model<Seller>>(
    {
        name: {
            type: String,
            required: true,
        },
        contactDetails: {
            phone: {
                type: String,
                required: true,
                trim: true,
            },
        },
        cityId: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Seller', sellerSchema);
