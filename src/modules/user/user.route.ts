import express from 'express';
import { UserController } from './user.controller';
import { validateRequestMiddleware } from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/admin-info', UserController.getAdminInfo);

router.get('/:userId', UserController.getProfile);

router.put(
  '/:userId',
  validateRequestMiddleware(UserValidation.updateProfileValidationSchema),
  UserController.updateProfile
);

export const UserRoutes = router;