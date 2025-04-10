import sellerController from '@controllers/seller.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createSellerSchema } from '@validators/seller.validation';
import { Router } from 'express';

// /seller
const sellerRouter = Router();

sellerRouter
    .use('/', authGuard, roleGuard('seller'))
    .post('/', V({ body: createSellerSchema }), sellerController.create)
    .patch('/', V({ body: createSellerSchema }), sellerController.update)
    .delete('/', sellerController.deleteSeller)
    .get('/', sellerController.getSeller);

export default sellerRouter;
