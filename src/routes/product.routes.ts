import { uploader } from '@configs/uploader';
import productController from '@controllers/product.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createProductSchema, updateProductSchema } from '@validators/product.validation';
import { objectIdSchema } from '@validators/validation';
import { Router } from 'express';

const productRouter = Router();

productRouter
    .route('/')
    .post(
        authGuard,
        roleGuard('admin'),
        uploader(2, 'image').array('images', 10),
        V({ body: createProductSchema }),
        productController.create
    );

productRouter
    .route('/:id')
    .get(productController.getProductDetails)
    .delete(authGuard, roleGuard('admin'), productController.deleteProduct)
    .put(
        authGuard,
        roleGuard('admin'),
        uploader(2, 'image').array('images', 10),
        V({ body: updateProductSchema, params: objectIdSchema }),
        productController.update
    );

export default productRouter;
