import type { Request, Response } from 'express';

import categoryModel from '@models/category.model';
import subCategoryModel from '@models/subCategory.model';
import { saveFile } from '@utils/saveFile';
import { isValidObjectId } from 'mongoose';

import { BaseController } from './base.controller';

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
            const filePath = await saveFile(req.file, ['images']);

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

        slug = await this.getUniqueSlug(subCategoryModel, slug);

        let icon = null;
        if (req.file) {
            const filePath = await saveFile(req.file, ['images']);

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
            await this.deleteFile(category.icon.path);
        }

        return this.successResponse(res, null, 'Category deleted successfully');
    };

    deleteSubcategory = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;

        const deletedCategory = await subCategoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return this.errorResponse(res, 'Category not found!', 404);
        }

        return this.successResponse(res, {}, 'Deleted category successfully');
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

        slug = await this.getUniqueSlug(categoryModel, slug);

        let icon = null;
        if (req.file) {
            if (category.icon) {
                await this.deleteFile(category.icon.path);
            }

            const filePath = await saveFile(req.file, ['images']);
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

    editSubcategory = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        const { title, parent, description, filters } = req.body;
        let { slug } = req.body;

        if (!isValidObjectId(id)) {
            return this.errorResponse(res, 'Invalid category ID', 400);
        }

        const subCategory = await subCategoryModel.findById(id);
        if (!subCategory) {
            return this.errorResponse(res, 'Subcategory not found', 404);
        }

        const parentCategory = await categoryModel.findById(parent);
        if (!parentCategory) {
            return this.errorResponse(res, 'Parent category not found', 404);
        }

        slug = subCategory.slug !== slug ? await this.getUniqueSlug(subCategoryModel, slug) : slug;

        const updatedSubcategory = await subCategoryModel.findByIdAndUpdate(
            id,
            { title, slug, parent, description, filters },
            { new: true }
        );

        return this.successResponse(res, updatedSubcategory, 'Category updated successfully');
    };

    getAllCategory = async (req: Request, res: Response): Promise<any> => {
        const fetchCategoriesWithSubs = async (parentId: string | null) => {
            const categories = await categoryModel.find({ parent: parentId }).lean();
            const subcategories = await subCategoryModel.find({ parent: parentId }).lean();

            const result = [...categories];

            await Promise.all(
                result.map(async (category) => {
                    const childCategories = await fetchCategoriesWithSubs(category._id);
                    const categorySubcategories = subcategories.filter(
                        (sub) => sub.parent.toString() === category._id.toString()
                    );

                    (category as any).children = {
                        categories: childCategories,
                        subcategories: categorySubcategories,
                    };
                })
            );

            return result;
        };

        const categories = await fetchCategoriesWithSubs(null);
        return this.successResponse(res, categories);
    };

    getAllSubcategories = async (req: Request, res: Response): Promise<any> => {
        const subcategories = await subCategoryModel.find({});

        this.successResponse(res, subcategories);
    };

    getSubcategory = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;

        const subcategory = await subCategoryModel.findOne({ _id: id });

        if (!subcategory) {
            return this.errorResponse(res, 'Category not found!', 404);
        }

        return this.successResponse(res, subcategory);
    };
}

export default new CategoryController();
