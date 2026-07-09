import express from 'express';
import { PaymentController } from './payment.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/create-payment-intent', auth(Role.TENANT), PaymentController.createPaymentIntent);

router.post('/', auth(Role.TENANT), PaymentController.savePayment);

export const PaymentRoutes = router;
