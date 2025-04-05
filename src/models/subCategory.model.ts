import type { Model } from 'mongoose';
import type { Subcategory } from 'src/types/category.types';

import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema<Subcategory, Model<Subcategory>>(
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
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
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

export default mongoose.model('Subcategory', subcategorySchema);
