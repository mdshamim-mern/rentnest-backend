import express from 'express';
import { SavedSearchController } from './savedSearch.controller';

const router = express.Router();

router.post('/', SavedSearchController.createSavedSearch);

export const SavedSearchRoutes = router;