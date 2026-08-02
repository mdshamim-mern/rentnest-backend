import express, { Request, Response, NextFunction } from 'express';
import { PropertyController } from './property.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { validateRequestMiddleware } from '../../middlewares/validateRequest';
import { PropertyValidation } from './property.validation';
import { upload } from '../../middlewares/upload';

const router = express.Router();

const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    const numericFields = ['price', 'floorArea', 'bedrooms', 'bathrooms', 'balcony', 'serviceCharge'];
    numericFields.forEach((field) => {
      if (req.body[field]) {
        req.body[field] = Number(req.body[field]);
      }
    });

    if (req.body.rentNegotiable !== undefined) {
      req.body.rentNegotiable = req.body.rentNegotiable === 'true';
    }
    if (req.body.isAvailable !== undefined) {
      req.body.isAvailable = req.body.isAvailable === 'true';
    }

    const arrayFields = ['amenities', 'rentFor'];
    arrayFields.forEach((field) => {
      if (req.body[field] && !Array.isArray(req.body[field])) {
        req.body[field] = [req.body[field]];
      }
    });
  }
  next();
};

router.post(
  '/',
  auth(Role.LANDLORD),
  upload.any(),
  parseFormData,
  validateRequestMiddleware(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty
);

router.get('/', PropertyController.getAllProperties);
router.get('/:id', PropertyController.getPropertyById);

router.patch(
  '/:id',
  auth(Role.LANDLORD, Role.ADMIN),
  upload.any(),
  parseFormData,
  validateRequestMiddleware(PropertyValidation.updatePropertyValidationSchema),
  PropertyController.updateProperty
);

router.delete('/:id', auth(Role.LANDLORD, Role.ADMIN), PropertyController.deleteProperty);

export const PropertyRoutes = router;