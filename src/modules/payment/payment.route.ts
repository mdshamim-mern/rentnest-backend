import express from 'express';
import { PaymentController } from './payment.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

// পেমেন্ট ইন্টেন্ট ক্রিয়েট করার রাউট
router.post('/create-payment-intent', auth(Role.TENANT), PaymentController.createPaymentIntent);

// পেমেন্ট ডাটাবেসে সেভ করার রাউট
router.post('/', auth(Role.TENANT), PaymentController.savePayment);

export const PaymentRoutes = router;