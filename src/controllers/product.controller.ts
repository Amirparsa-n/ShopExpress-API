/* eslint-disable no-await-in-loop */
import type { createProductSchema, updateProductSchema } from '@validators/product.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import noteModel from '@models/note.model';
import productModel from '@models/product.model';
import subCategoryModel from '@models/subCategory.model';
import { findUniqueIdentifier, isValidateSeller } from '@services/Product.service';
import { saveFile } from '@utils/saveFile';
import { isValidObjectId } from 'mongoose';

import { BaseController } from './base.controller';

class ProductController extends BaseController {
    create = async (req: Request<any, any, z.infer<typeof createProductSchema>>, res: Response): Promise<any> => {
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

        // Delete all notes related to the product
        await noteModel.deleteMany({ product: product.id });

        return this.successResponse(res, { product }, 'Product deleted successfully!');
    };

    getProductDetails = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return this.errorResponse(res, 'Invalid product ID', 400);
        }

        const product = await productModel.findOne({ _id: id }).populate('subCategory').populate('sellers.seller');
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        const { images, ...productDetails } = product.toObject();
        const imageUrls = images.map((image) => this.getFileUrl(image));
        const productWithImageUrls = {
            ...productDetails,
            images: imageUrls,
        };

        return this.successResponse(res, productWithImageUrls);
    };

    update = async (req: Request<any, any, z.infer<typeof updateProductSchema>>, res: Response): Promise<any> => {
        const { id } = req.params;
        const { name, description, subCategory, deleteImages } = req.body;
        let { slug, filterValues, customFilters } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        filterValues = typeof filterValues === 'string' ? JSON.parse(filterValues as any) : filterValues;
        customFilters = typeof customFilters === 'string' ? JSON.parse(customFilters as any) : customFilters;

        // Validation subCategory
        const currentSubCategory = await subCategoryModel.findById(subCategory);
        if (!currentSubCategory) {
            return this.errorResponse(res, 'SubCategory not found', 400);
        }

        if (slug && slug !== product.slug) {
            slug = await this.getUniqueSlug(productModel, slug);
        }

        let images = product.images;

        if (deleteImages?.length) {
            deleteImages.forEach(async (index) => {
                const image = images[+index];
                if (image) {
                    await this.deleteFile(image);
                    images.splice(+index, 1);
                }
            });
        }

        if (req.files) {
            const files = Array.isArray(req.files) ? req.files : [];
            const newImages = await Promise.all(files.map((file) => saveFile(file, ['images', 'products'])));
            images = [...images, ...newImages];
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            {
                name,
                slug,
                customFilters,
                description,
                filterValues,
                images,
                subCategory,
            },
            { new: true }
        );

        return this.successResponse(res, updatedProduct, 'Product updated successfully!');
    };
}

export default new ProductController();
