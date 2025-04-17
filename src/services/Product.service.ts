import productModel from '@models/product.model';
import sellerModel from '@models/seller.model';
import { nanoid } from 'nanoid';

export const findUniqueIdentifier = async () => {
    const identifier = nanoid(6);
    const product = await productModel.findOne({ shortIdentifier: identifier });
    return product ? null : identifier;
};

export const isValidateSeller = async (sellers: { id: string; price: number; stock: number }[]) => {
    for (const { id: sellerId } of sellers) {
        // eslint-disable-next-line no-await-in-loop
        const sellerExists = await sellerModel.exists({ _id: sellerId });
        if (!sellerExists) {
            return false;
        }
    }
    return true;
};
