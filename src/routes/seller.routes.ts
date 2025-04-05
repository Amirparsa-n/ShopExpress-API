import sellerController from '@controllers/seller.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createSellerValidate } from '@validators/seller.validation';
import { Router } from 'express';

// /seller
const sellerRouter = Router();

sellerRouter
    .use('/', authGuard, roleGuard('seller'))
    .post('/', V(createSellerValidate), sellerController.create)
    .patch('/', V(createSellerValidate), sellerController.update)
    .delete('/', sellerController.deleteSeller)
    .get('/', sellerController.getSeller);

export default sellerRouter;
