import type { Model } from 'mongoose';
import type { User } from 'src/types/user.types';

import mongoose from 'mongoose';

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

const userSchema = new mongoose.Schema<User, Model<User>>(
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
            maxLength: 100,
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
            sparse: true,
            lowercase: true,
        },
        // password: {
        //     type: String,
        //     required: false,
        //     minlength: 6,
        //     maxLength: 100,
        // },
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
