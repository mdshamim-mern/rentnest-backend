import express from 'express';
import { AuthController } from './auth.controller';
import { validateRequestMiddleware } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post(
  '/signup',
  validateRequestMiddleware(AuthValidation.signupValidationSchema),
  AuthController.signup
);

router.post(
  '/login',
  validateRequestMiddleware(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.get(
  '/me',
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  AuthController.getMe
);

export const AuthRoutes = router;