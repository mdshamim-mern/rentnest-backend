import express from 'express';
import { PropertyController } from './property.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { validateRequestMiddleware } from '../../middlewares/validateRequest';
import { PropertyValidation } from './property.validation';

const router = express.Router();

// প্রপার্টি তৈরি করার সময় কড়া চেকিং হবে
router.post(
  '/',
  auth(Role.LANDLORD),
  validateRequestMiddleware(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty
);

// সবাই প্রপার্টি দেখতে পারবে (ভ্যালিডেশন লাগে না)
router.get('/', PropertyController.getAllProperties);
router.get('/:id', PropertyController.getPropertyById);

// আপডেট করার সময় অপশনাল ভ্যালিডেশন কাজ করবে
router.patch(
  '/:id',
  auth(Role.LANDLORD, Role.ADMIN),
  validateRequestMiddleware(PropertyValidation.updatePropertyValidationSchema),
  PropertyController.updateProperty
);

router.delete('/:id', auth(Role.LANDLORD, Role.ADMIN), PropertyController.deleteProperty);

export const PropertyRoutes = router;