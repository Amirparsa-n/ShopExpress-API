import productModel from '@models/product.model';
import { nanoid } from 'nanoid';

export const findUniqueIdentifier = async () => {
    const identifier = nanoid(6);
    const product = await productModel.findOne({ shortIdentifier: identifier });
    return product ? null : identifier;
};
