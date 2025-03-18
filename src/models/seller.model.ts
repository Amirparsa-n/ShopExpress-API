import mongoose, { Model } from 'mongoose';
import { ISeller } from 'src/types/seller.types';

const sellerSchema = new mongoose.Schema<ISeller, Model<ISeller>>(
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
