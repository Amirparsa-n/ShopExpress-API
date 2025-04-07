import { uploader } from '@configs/uploader';
import categoryController from '@controllers/category.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { categorySchema, subCategorySchema } from '@validators/category.validation';
import { objectIdSchema } from '@validators/validation';
import { Router } from 'express';

const categoryRouter = Router();

// Admin
categoryRouter
    .route('/')
    .get(categoryController.getAllCategory)
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
    .route('/sub/')
    .get(categoryController.getAllSubcategories)
    .post(
        authGuard,
        roleGuard('admin'),
        uploader(1, 'image').single('icon'),
        V({ body: subCategorySchema }),
        categoryController.createSubcategory
    );

categoryRouter
    .route('/sub/:id')
    .get(V({ params: objectIdSchema }), categoryController.getSubcategory)
    .delete(authGuard, roleGuard('admin'), V({ params: objectIdSchema }), categoryController.deleteSubcategory);

export default categoryRouter;
