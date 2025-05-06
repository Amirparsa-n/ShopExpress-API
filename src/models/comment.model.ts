import type { Model } from 'mongoose';
import type { Comment, Reply } from 'src/types/comment.types';

import mongoose from 'mongoose';

const replySchema = new mongoose.Schema<Reply, Model<Reply>>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const commentSchema = new mongoose.Schema<Comment, Model<Comment>>(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            red: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        replies: [replySchema],
    },
    { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
