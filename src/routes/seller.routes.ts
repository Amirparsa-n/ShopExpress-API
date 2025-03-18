import { Router } from 'express';
import sellerController from '@controllers/seller.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createSellerValidate } from '@validators/seller.validation';

// /seller
const sellerRoute = Router();

sellerRoute.post('/', authGuard, roleGuard('seller'), V(createSellerValidate), sellerController.create);

export default sellerRoute;
