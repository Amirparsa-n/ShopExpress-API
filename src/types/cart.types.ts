import type { ObjectId } from 'mongoose';

export interface Cart {
    _id: string;
    user: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
