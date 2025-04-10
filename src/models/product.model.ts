import type { Model } from 'mongoose';
import type { Product, ProductSeller } from 'src/types/product.types';

import mongoose from 'mongoose';
import { string } from 'zod';

const sellersSchema = new mongoose.Schema<ProductSeller, Model<ProductSeller>>({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
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
});

const productSchema = new mongoose.Schema<Product, Model<Product>>(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategory',
            required: true,
        },
        images: {
            type: [
                {
                    type: String,
                    required: true,
                },
            ],
        },
        sellers: {
            type: [sellersSchema],
        },
        filterValues: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            required: true,
        },
        shortIdentifier: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Product', productSchema);
