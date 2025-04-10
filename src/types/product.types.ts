import type { ObjectId } from 'mongoose';

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    subCategory: string | ObjectId;
    images: string[];
    sellers: ProductSeller[];
    filterValues: Map<string, any>;
    customFilters: Map<string, any>;
    shortIdentifier: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductSeller {
    _id: string;
    seller: string | ObjectId;
    price: number;
    stock: number;
}
