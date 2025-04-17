/* eslint-disable no-await-in-loop */
import type { productSchema } from '@validators/product.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import { publicDir } from '@configs/config';
import productModel from '@models/product.model';
import subCategoryModel from '@models/subCategory.model';
import { findUniqueIdentifier, isValidateSeller } from '@services/Product.service';
import { saveFile } from '@utils/saveFile';
import path from 'node:path';

import { BaseController } from './base.controller';

class ProductController extends BaseController {
    create = async (req: Request<any, any, z.infer<typeof productSchema>>, res: Response): Promise<any> => {
        const { name, description, subCategory } = req.body;
        let { slug, sellers, filterValues, customFilters } = req.body;

        sellers = typeof customFilters === 'string' ? JSON.parse(sellers as any) : sellers;
        filterValues = typeof filterValues === 'string' ? JSON.parse(filterValues as any) : filterValues;
        customFilters = typeof customFilters === 'string' ? JSON.parse(customFilters as any) : customFilters;

        const currentSubCategory = await subCategoryModel.findById(subCategory);
        if (!currentSubCategory) {
            return this.errorResponse(res, 'SubCategory not found', 400);
        }

        // Validate Sellers
        const isValidSeller = await isValidateSeller(sellers);
        if (!isValidSeller) {
            return this.errorResponse(res, 'Invalid seller ID', 400);
        }

        let shortIdentifier: string | null;
        do {
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
            sellers: sellers.map((seller) => ({
                seller: seller.id,
                price: seller.price,
                stock: seller.stock,
            })),
            shortIdentifier,
            subCategory,
        });

        return this.successResponse(res, newProduct, 'Product created successfully!');
    };
}

export default new ProductController();
