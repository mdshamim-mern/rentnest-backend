import express from 'express';
import { AuthController } from './auth.controller';
import { validateRequestMiddleware } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = express.Router();

// সাইনআপ রাউটে ভ্যালিডেশন মিডলওয়্যার বসিয়ে দিলাম
router.post(
  '/signup',
  validateRequestMiddleware(AuthValidation.signupValidationSchema),
  AuthController.signup
);

// লগইন রাউটেও ভ্যালিডেশন মিডলওয়্যার বসিয়ে দিলাম
router.post(
  '/login',
  validateRequestMiddleware(AuthValidation.loginValidationSchema),
  AuthController.login
);

export const AuthRoutes = router;