import express from 'express';
import { RentalController } from './rental.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', auth(Role.TENANT), RentalController.createRentalRequest);
router.get('/all', auth(Role.ADMIN), RentalController.getAllRentalRequests);
router.get('/', auth(Role.TENANT), RentalController.getMyRentals);
router.get('/:id', auth(Role.TENANT), RentalController.getRentalById);
router.patch('/:id/status', auth(Role.ADMIN, Role.LANDLORD), RentalController.updateRentalRequestStatus);

export const RentalRoutes = router;