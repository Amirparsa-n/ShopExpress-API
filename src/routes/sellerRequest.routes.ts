import sellerRequestController from '@controllers/sellerRequest.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createSellerRequestSchema, updateSellerRequestSchema } from '@validators/sellerRequest.validation';
import { objectIdSchema } from '@validators/validation';
import { Router } from 'express';

const sellerRequestRouter = Router();

sellerRequestRouter.get('/?', authGuard, roleGuard('seller'), sellerRequestController.getAllRequest);

sellerRequestRouter.post(
    '/',
    authGuard,
    roleGuard('seller'),
    V({ body: createSellerRequestSchema }),
    sellerRequestController.createRequest
);

sellerRequestRouter
    .route('/:id')
    .patch(
        authGuard,
        roleGuard('admin'),
        V({ body: updateSellerRequestSchema, params: objectIdSchema() }),
        sellerRequestController.updateRequest
    )
    .delete(authGuard, roleGuard('seller'), sellerRequestController.deleteRequest);

export default sellerRequestRouter;
