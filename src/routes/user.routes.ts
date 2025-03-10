import { Router } from 'express';
import userController from '@controllers/user.controller';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { authGuard } from '@middlewares/authGuard.middleware';

// /api/users
const userRoute = Router();

userRoute.get('/ban/:userId', authGuard, roleGuard('admin'), userController.banUser);

export default userRoute;
