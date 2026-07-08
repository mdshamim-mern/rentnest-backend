import express from 'express';
import { RentalController } from './rental.controller';
// import auth from '../../middlewares/auth'; 
// import { Role } from '@prisma/client'; 

import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

// router.post('/', auth(Role.TENANT), RentalController.createRentalRequest);

router.post('/', auth(Role.TENANT), RentalController.createRentalRequest);

router.get('/', RentalController.getAllRentalRequests);

router.patch('/:id/status', auth(Role.ADMIN, Role.LANDLORD), RentalController.updateRentalRequestStatus);

export const RentalRoutes = router;