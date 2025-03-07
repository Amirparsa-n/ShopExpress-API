import mongoose from 'mongoose';

const banSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
    },
});

export default mongoose.model('Ban', banSchema);
