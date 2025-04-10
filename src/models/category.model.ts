import type { Model } from 'mongoose';
import type { Category } from 'src/types/category.types';

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema<Category, Model<Category>>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
        },
        icon: {
            type: {
                filename: { type: String, required: true, trim: true },
                path: { type: String, required: true, trim: true },
            },
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },

        filters: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    slug: {
                        type: String,
                        required: true,
                        lowercase: true,
                        trim: true,
                    },
                    description: {
                        type: String,
                        required: false,
                    },
                    type: {
                        type: String,
                        required: true,
                        enum: ['radio', 'checkbox'],
                    },
                    options: {
                        type: [String],
                    },
                    min: { type: Number },
                    max: { type: Number },
                },
            ],
        },
    },
    { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
