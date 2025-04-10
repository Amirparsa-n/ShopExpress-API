export interface User {
    _id: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password: string;
    role: Role;
    addresses: AddressType[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type Role = 'admin' | 'seller' | 'user';

export interface AddressType {
    name: string;
    postalCode: string;
    location: {
        lat: number;
        lng: number;
    };
    address: string;
    cityId: string;
}
