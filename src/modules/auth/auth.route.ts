import express from 'express';
import { AuthController } from './auth.controller';
import { validateRequestMiddleware } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

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

export const AuthRoutes = router;
