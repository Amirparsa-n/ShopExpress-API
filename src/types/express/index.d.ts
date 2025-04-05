declare global {
    namespace Express {
        interface Request {
            user: {
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
            };
        }
    }
}
