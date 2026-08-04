import express from 'express';
import { LandlordController } from './landlord.controller';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/requests', auth('LANDLORD'), LandlordController.getLandlordRequests);
router.get('/tour-requests', auth('LANDLORD'), LandlordController.getLandlordTourRequests);
router.patch('/requests/:id', auth('LANDLORD'), LandlordController.updateRequestStatus);
router.patch('/tour-requests/:id', auth('LANDLORD'), LandlordController.updateTourStatus);
router.put('/properties/:id', auth('LANDLORD'), LandlordController.updateProperty);
router.delete('/properties/:id', auth('LANDLORD'), LandlordController.deleteProperty);

export const LandlordRoutes = router;