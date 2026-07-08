import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/:userId', UserController.getProfile);
router.put('/:userId', UserController.updateProfile);

export const UserRoutes = router;