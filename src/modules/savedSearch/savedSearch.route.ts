import express from 'express';
import { SavedSearchController } from './savedSearch.controller';

const router = express.Router();

router.post('/', SavedSearchController.createSavedSearch);
router.get('/', SavedSearchController.getAllSavedSearches);
router.delete('/:id', SavedSearchController.deleteSavedSearch);

export const SavedSearchRoutes = router;