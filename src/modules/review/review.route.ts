import express from 'express';
import { ReviewController } from './review.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

// শুধুমাত্র লগইন করা ইউজার (TENANT) রিভিউ দিতে পারবে
router.post('/', auth(Role.TENANT), ReviewController.createReview);

// প্রপার্টির আইডি দিয়ে তার সব রিভিউ જોવાর রাউট
router.get('/:propertyId', ReviewController.getReviewsByProperty);

export const ReviewRoutes = router;