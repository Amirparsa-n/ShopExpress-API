import type { ObjectId } from 'mongoose';

export interface Note {
    user: ObjectId;
    product: ObjectId;
    content: string;
}
