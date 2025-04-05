import type { Request, Response } from 'express';

import categoryModel from '@models/category.model';
import { saveFile } from '@utils/saveFile';
import path from 'node:path';

import { BaseController } from './base.controller';

class CategoryController extends BaseController {
    createCategory = async (req: Request, res: Response): Promise<any> => {
        const { title, parent, description, filters } = req.body;
        let { slug } = req.body;

        let icon = null;
        if (req.file) {
            const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'images');
            const filePath = await saveFile(req.file, uploadDir);

            icon = {
                filename: req.file.originalname,
                path: filePath,
            };
        }

        if (await categoryModel.findOne({ title })) {
            return this.errorResponse(res, 'Category with the same title already exists');
        }

        slug = await this.getUniqueSlug(categoryModel, slug);

        const category = await categoryModel.create({ title, slug, parent, description, filters, icon });

        return this.successResponse(res, category, 'Category created successfully');
    };
}

export default new CategoryController();
