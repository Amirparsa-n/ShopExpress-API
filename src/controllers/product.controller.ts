import type { Request, Response } from 'express';
import type { Product } from 'src/types/product.types';

import { publicDir } from '@configs/config';
import productModel from '@models/product.model';
import { findUniqueIdentifier } from '@services/Product.service';
import { saveFile } from '@utils/saveFile';
import path from 'node:path';

import { BaseController } from './base.controller';

class ProductController extends BaseController {
    create = async (req: Request<any, any, Product>, res: Response): Promise<any> => {
        const { name, description, subCategory } = req.body;
        let { slug, sellers, filterValues, customFilters } = req.body;

        sellers = JSON.parse(sellers as any);
        filterValues = JSON.parse(filterValues as any);
        customFilters = JSON.parse(customFilters as any);

        let shortIdentifier: string | null;
        do {
            // eslint-disable-next-line no-await-in-loop
            shortIdentifier = await findUniqueIdentifier();
        } while (!shortIdentifier);

        slug = await this.getUniqueSlug(productModel, slug);

        const uploadDir = path.join(publicDir, 'uploads', 'images', 'products');
        const files = Array.isArray(req.files) ? req.files : [];
        const images = await Promise.all(files.map((file) => saveFile(file, uploadDir)));

        const newProduct = await productModel.create({
            name,
            slug,
            customFilters,
            description,
            filterValues,
            images,
            sellers,
            shortIdentifier,
            subCategory,
        });

        return this.successResponse(res, newProduct, 'Product created successfully!');
    };
}

export default new ProductController();
