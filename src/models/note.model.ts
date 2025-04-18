import type { Model } from 'mongoose';
import type { Note } from 'src/types/note.types';

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema<Note, Model<Note>>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

export default mongoose.model('Note', noteSchema);
