import { Router } from 'express';
import locationController from '@controllers/location.controller';

const locationRouter = Router();

locationRouter.get('/cities', locationController.getAllCities);

export default locationRouter;
