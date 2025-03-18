import { Router } from 'express';
import sellerController from '@controllers/seller.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createSellerValidate } from '@validators/seller.validation';

// /seller
const sellerRouter = Router();

sellerRouter
    .use('/', authGuard, roleGuard('seller'))
    .post('/', V(createSellerValidate), sellerController.create)
    .patch('/', V(createSellerValidate), sellerController.update)
    .delete('/:id', sellerController.deleteSeller);

export default sellerRouter;
