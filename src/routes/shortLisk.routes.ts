import shortIdentifierController from '@controllers/shortIdentifier.controller';
import { Router } from 'express';

const shortLinkRouter = Router();

shortLinkRouter.get('/p/:shortIdentifier', shortIdentifierController.redirectToProduct);

export default shortLinkRouter;
