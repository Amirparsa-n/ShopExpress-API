import type { ObjectId } from 'mongoose';

import type { Product } from './product.types';
import type { Seller } from './seller.types';
import type { User } from './user.types';

export interface CartItem {
    product: Product | any;
    seller: Seller | any;
    quantity: number;
    priceAtTimeOfAdding: number;
    totalPrice?: number;
}

export interface Cart {
    _id: string;
    user: ObjectId | User;
    items: CartItem[];
    createdAt?: Date;
    updatedAt?: Date;
}
