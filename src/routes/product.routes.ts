import { uploader } from '@configs/uploader';
import productController from '@controllers/product.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { productSchema } from '@validators/product.validation';
import { Router } from 'express';

const productRouter = Router();

productRouter
    .route('/')
    .post(
        authGuard,
        roleGuard('admin'),
        uploader(2, 'image').array('images', 10),
        V({ body: productSchema }),
        productController.create
    );

productRouter
    .route('/:id')
    .get(productController.getProductDetails)
    .delete(authGuard, roleGuard('admin'), productController.deleteProduct);

export default productRouter;
