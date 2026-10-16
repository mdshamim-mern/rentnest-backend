import express from 'express';
import { AuthController } from './auth.controller';
import { validateRequestMiddleware } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { AuthService } from './auth.service';

const router = express.Router();

router.get('/providers', (_req, res) => {
  res.json({ success: true, data: { googleClientId: process.env.GOOGLE_CLIENT_ID || null } });
});

router.post('/google', validateRequestMiddleware(z.object({ body: z.object({
  credential: z.string().min(1).max(10000),
  role: z.enum(['TENANT', 'LANDLORD']).default('TENANT'),
}) })), async (req, res) => {
  try {
    const data = await AuthService.googleLogin(req.body.credential, req.body.role === 'LANDLORD' ? 'LANDLORD' : 'TENANT');
    res.json({ success: true, message: 'Signed in with Google', data });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message || 'Google sign-in failed' });
  }
});

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
