import sellerRequestController from '@controllers/sellerRequest.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createSellerRequestSchema } from '@validators/sellerRequest.validation';
import { Router } from 'express';

const sellerRequestRouter = Router();

sellerRequestRouter.get('/', authGuard, roleGuard('admin'), sellerRequestController.getAllRequest);

sellerRequestRouter.post(
    '/',
    authGuard,
    roleGuard('seller'),
    V({ body: createSellerRequestSchema }),
    sellerRequestController.createRequest
);

sellerRequestRouter
    .route('/:id')
    .get(authGuard, roleGuard('admin'), sellerRequestController.getRequestById)
    .patch(authGuard, roleGuard('admin'), sellerRequestController.updateRequest)
    .delete(authGuard, roleGuard('seller'), sellerRequestController.deleteRequest);

export default sellerRequestRouter;
