import express from 'express';
import { ReviewController } from './review.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', auth(Role.TENANT), ReviewController.createReview);
router.get('/:propertyId', ReviewController.getReviewsByProperty);
router.delete('/:id', auth(Role.ADMIN), ReviewController.deleteReview);

export const ReviewRoutes = router;