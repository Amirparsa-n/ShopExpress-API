import { uploader } from '@configs/uploader';
import categoryController from '@controllers/category.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { categorySchema, subCategorySchema } from '@validators/category.validation';
import { Router } from 'express';

const categoryRouter = Router();

// Admin
categoryRouter
    .route('/')
    .post(
        authGuard,
        roleGuard('admin'),
        uploader(1, 'image').single('icon'),
        V({ body: categorySchema }),
        categoryController.createCategory
    );

categoryRouter
    .route('/:id')
    .delete(authGuard, roleGuard('admin'), categoryController.deleteCategory)
    .patch(
        authGuard,
        roleGuard('admin'),
        uploader(1, 'image').single('icon'),
        V({ body: categorySchema }),
        categoryController.editCategory
    );

// Subcategory
categoryRouter
    .route('/sub')
    .post(
        authGuard,
        roleGuard('admin'),
        uploader(1, 'image').single('icon'),
        V({ body: subCategorySchema }),
        categoryController.createSubcategory
    );

export default categoryRouter;
