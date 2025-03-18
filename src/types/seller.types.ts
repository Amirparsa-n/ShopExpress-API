export interface ISeller {
    name: string;
    contactDetails: { phone: string };
    cityId: number;
    user?: any;
    createdAt?: Date;
    updatedAt?: Date;
}
