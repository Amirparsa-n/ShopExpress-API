import { Router } from 'express';
import userController from '@controllers/user.controller';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { authGuard } from '@middlewares/authGuard.middleware';
import { addressValidate, updateAddressValidate } from '@validators/user.validation';
import { V } from '@middlewares/validation.middleware';

// /api/users
const userRoute = Router();

userRoute.get('/ban/:userId', authGuard, roleGuard('admin'), userController.banUser);

userRoute.post('/me/addresses', authGuard, V(addressValidate), userController.addAddress);
userRoute.put('/me/addresses/:addressId', authGuard, V(updateAddressValidate), userController.updateAddress);
userRoute.delete('/me/addresses/:addressId', authGuard, userController.deleteAddress);

// Admin
userRoute.get('/getAll?', authGuard, roleGuard('admin'), userController.getAll);

export default userRoute;
