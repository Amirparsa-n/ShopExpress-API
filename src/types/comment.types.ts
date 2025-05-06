import type { ObjectId } from 'mongoose';

export interface Comment {
    _id: string;
    product: ObjectId;
    user: ObjectId;
    rating: number;
    content: string;
    replies: Reply[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Reply {
    _id: string;
    user: ObjectId;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}
