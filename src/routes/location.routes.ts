import locationController from '@controllers/location.controller';
import { Router } from 'express';

const locationRouter = Router();

locationRouter.get('/cities', locationController.getAllCities);

export default locationRouter;
