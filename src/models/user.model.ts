import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/types/user.types';

const addressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    postalCode: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    address: { type: String, required: true },
    cityId: { type: String, required: true },
});

const userSchema = new mongoose.Schema<IUser, Model<IUser>>(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: false,
            minlength: 3,
            maxlength: 100,
        },
        lastName: {
            type: String,
            required: false,
            minlength: 3,
            maxlength: 100,
        },
        email: {
            type: String,
            required: false,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 100,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'seller'],
            default: 'user',
        },
        addresses: [addressSchema],
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);
