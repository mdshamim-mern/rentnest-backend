import express from 'express';
import { PropertyController } from './property.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { validateRequestMiddleware } from '../../middlewares/validateRequest';
import { PropertyValidation } from './property.validation';
import { upload } from '../../middlewares/upload';

const router = express.Router();

router.post(
  '/',
  auth(Role.LANDLORD),
  upload.any(),
  validateRequestMiddleware(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty
);

router.get('/', PropertyController.getAllProperties);
router.get('/:id', PropertyController.getPropertyById);

router.patch(
  '/:id',
  auth(Role.LANDLORD, Role.ADMIN),
  upload.any(),
  validateRequestMiddleware(PropertyValidation.updatePropertyValidationSchema),
  PropertyController.updateProperty
);

router.delete('/:id', auth(Role.LANDLORD, Role.ADMIN), PropertyController.deleteProperty);

export const PropertyRoutes = router;