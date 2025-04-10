export interface Seller {
    name: string;
    contactDetails: { phone: string };
    cityId: number;
    user?: any;
    createdAt?: Date;
    updatedAt?: Date;
}
