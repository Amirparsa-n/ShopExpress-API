import type { Types } from 'mongoose';

export interface CheckoutItem {
    product: Types.ObjectId; // Reference to 'Product'
    seller: Types.ObjectId; // Reference to 'Seller'
    quantity: number;
    priceAtTimeOfPurchase: number;
}

export interface ShippingAddress {
    postalCode: string;
    location: {
        lat: number;
        lng: number;
    };
    address: string;
    cityId: number;
}

export interface Checkout {
    user: Types.ObjectId; // Reference to 'User'
    items: CheckoutItem[];
    shippingAddress: ShippingAddress;
    authority: string;
    totalPrice?: number;
    expireAt: string | Date;
}
