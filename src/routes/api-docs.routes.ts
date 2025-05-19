import { config } from '@configs/config';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const apiDocsRouter = Router();

const isProduction = config.get('isProduction');

let swaggerDocument: any;
if (!isProduction) {
    // eslint-disable-next-line n/global-require, @typescript-eslint/no-require-imports
    swaggerDocument = require('../configs/swagger.json');
}

if (!isProduction) {
    apiDocsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default apiDocsRouter;
