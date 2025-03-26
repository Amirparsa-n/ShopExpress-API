import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import categoryModel from '@models/category.model';
import { saveFile } from '@utils/saveFile';
import path from 'path';

class Category extends BaseController {
    createCategory = async (req: Request, res: Response): Promise<any> => {
        let { title, slug, parent, description, filters } = req.body;

        // filters = JSON.parse(filters);

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

export default new Category();
