import { Router } from 'express';
import userController from '@controllers/user.controller';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { authGuard } from '@middlewares/authGuard.middleware';
import { addressValidate } from '@validators/user.validation';
import { V } from '@middlewares/validation.middleware';

// /api/users
const userRoute = Router();

userRoute.get('/ban/:userId', authGuard, roleGuard('admin'), userController.banUser);

userRoute.get('/me/addresses', authGuard, V(addressValidate), userController.addAddress);
userRoute.delete('/me/addresses/:addressId', authGuard, userController.deleteAddress);

export default userRoute;
