export interface IUser {
    phone: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password: string;
    role: Role;
    addresses: AddressType[];
}

export type Role = 'user' | 'admin' | 'seller';

export type AddressType = {
    name: string;
    postalCode: string;
    location: {
        lat: number;
        lng: number;
    };
    address: string;
    cityId: string;
};
