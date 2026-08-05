import express from 'express';
import { SavedSearchController } from './savedSearch.controller';

const router = express.Router();

router.post('/', SavedSearchController.createSavedSearch);
router.get('/', SavedSearchController.getAllSavedSearches);

export const SavedSearchRoutes = router;