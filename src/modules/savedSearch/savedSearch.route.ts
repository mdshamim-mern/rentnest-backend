import express from 'express';
import { SavedSearchController } from './savedSearch.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();
router.post(

  '/',
  
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  SavedSearchController.createSavedSearch
);

router.get(

  '/',

  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  SavedSearchController.getAllSavedSearches
);

router.delete(

  '/:id',

  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  SavedSearchController.deleteSavedSearch
);
export const SavedSearchRoutes = router;