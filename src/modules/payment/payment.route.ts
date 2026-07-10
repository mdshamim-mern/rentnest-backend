import express from 'express';
import { PaymentController } from './payment.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/create-payment-intent', auth(Role.TENANT), PaymentController.createPaymentIntent);
router.post('/save', auth(Role.TENANT), PaymentController.savePayment);
router.get('/', auth(Role.TENANT), PaymentController.getMyPayments);
router.get('/:id', auth(Role.TENANT), PaymentController.getPaymentById);

export const PaymentRoutes = router;