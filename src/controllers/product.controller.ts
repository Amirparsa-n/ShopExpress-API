/* eslint-disable no-await-in-loop */
import type { productSchema } from '@validators/product.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import productModel from '@models/product.model';
import subCategoryModel from '@models/subCategory.model';
import { findUniqueIdentifier, isValidateSeller } from '@services/Product.service';
import { saveFile } from '@utils/saveFile';
import { isValidObjectId } from 'mongoose';

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

        const files = Array.isArray(req.files) ? req.files : [];
        const images = await Promise.all(files.map((file) => saveFile(file, ['images', 'products'])));

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

    deleteProduct = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return this.errorResponse(res, 'Invalid product ID', 400);
        }

        const product = await productModel.findById(id);
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        for (const image of product.images) {
            await this.deleteFile(image);
        }

        await productModel.deleteOne({ _id: product.id });

        return this.successResponse(res, { product }, 'Product deleted successfully!');
    };
}

export default new ProductController();
