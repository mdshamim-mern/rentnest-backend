import express from 'express';
import { TourController } from './tour.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', auth(Role.TENANT), TourController.createTourRequest);
router.get('/my-tours', auth(Role.TENANT), TourController.getMyTourRequests);
router.get('/landlord', auth(Role.LANDLORD), TourController.getLandlordTourRequests);

export const TourRoutes = router;