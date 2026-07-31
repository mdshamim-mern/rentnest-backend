import express from 'express';
import { TourController } from './tour.controller';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post('/', auth('TENANT'), TourController.createTourRequest);
router.get('/landlord', auth('LANDLORD'), TourController.getLandlordTourRequests);

export const TourRoutes = router;