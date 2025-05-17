export interface Seller {
    _id: string;
    name: string;
    contactDetails: { phone: string };
    cityId: number;
    user?: any;
    createdAt?: Date;
    updatedAt?: Date;
}
