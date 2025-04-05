import { uploader } from '@configs/uploader';
import categoryController from '@controllers/category.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { categorySchema } from '@validators/category.validation';
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

export default categoryRouter;
