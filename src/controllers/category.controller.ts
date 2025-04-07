import type { Request, Response } from 'express';

import { publicDir } from '@configs/config';
import categoryModel from '@models/category.model';
import { saveFile } from '@utils/saveFile';
import { isValidObjectId } from 'mongoose';
import path from 'node:path';

import { BaseController } from './base.controller';
import subCategoryModel from '@models/subCategory.model';

class CategoryController extends BaseController {
    createCategory = async (req: Request, res: Response): Promise<any> => {
        const { title, parent, description, filters } = req.body;
        let { slug } = req.body;

        if (await categoryModel.findOne({ title })) {
            return this.errorResponse(res, 'Category with the same title already exists');
        }

        slug = await this.getUniqueSlug(categoryModel, slug);

        let icon = null;
        if (req.file) {
            const uploadDir = path.join(publicDir, 'uploads', 'images');
            const filePath = await saveFile(req.file, uploadDir);

            icon = {
                filename: req.file.originalname,
                path: filePath,
            };
        }

        const category = await categoryModel.create({ title, slug, parent, description, filters, icon });

        return this.successResponse(res, category, 'Category created successfully');
    };

    createSubcategory = async (req: Request, res: Response): Promise<any> => {
        const { title, parent, description, filters } = req.body;
        let { slug } = req.body;

        const parentCategory = await categoryModel.findById(parent);
        if (!parentCategory) {
            return this.errorResponse(res, 'Parent category not found', 404);
        }

        slug = await this.getUniqueSlug(categoryModel, slug);

        let icon = null;
        if (req.file) {
            const uploadDir = path.join(publicDir, 'uploads', 'images');
            const filePath = await saveFile(req.file, uploadDir);

            icon = {
                filename: req.file.originalname,
                path: filePath,
            };
        }

        const subcategory = await subCategoryModel.create({ title, slug, parent, description, filters, icon });

        return this.successResponse(res, subcategory, 'Subcategory created successfully');
    };

    deleteCategory = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return this.errorResponse(res, 'Invalid category ID', 400);
        }

        const category = await categoryModel.findByIdAndDelete(id);
        if (!category) {
            return this.errorResponse(res, 'Category not found', 404);
        }

        if (category.icon) {
            const filePath = path.join(publicDir, category.icon.path);
            await this.deleteFile(filePath);
        }

        return this.successResponse(res, null, 'Category deleted successfully');
    };

    editCategory = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        const { title, parent, description, filters } = req.body;
        let { slug } = req.body;

        if (!isValidObjectId(id)) {
            return this.errorResponse(res, 'Invalid category ID', 400);
        }

        const category = await categoryModel.findById(id);
        if (!category) {
            return this.errorResponse(res, 'Category not found', 404);
        }

        if (await categoryModel.findOne({ title })) {
            return this.errorResponse(res, 'Category with the same title already exists');
        }

        slug = await this.getUniqueSlug(categoryModel, slug);

        let icon = null;
        if (req.file) {
            if (category.icon) {
                const filePath = path.join(publicDir, category.icon.path);
                await this.deleteFile(filePath);
            }

            const uploadDir = path.join(publicDir, 'uploads', 'images');
            const filePath = await saveFile(req.file, uploadDir);
            icon = {
                filename: req.file.originalname,
                path: filePath,
            };
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { title, slug, parent, description, filters, icon },
            { new: true }
        );

        return this.successResponse(res, updatedCategory, 'Category updated successfully');
    };
}

export default new CategoryController();
