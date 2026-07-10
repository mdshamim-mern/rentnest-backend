import express from 'express';
import { AdminController } from './admin.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/users', auth(Role.ADMIN), AdminController.getAllUsers);
router.patch('/users/:id', auth(Role.ADMIN), AdminController.updateUserStatus);
router.get('/properties', auth(Role.ADMIN), AdminController.getAllProperties);
router.get('/rentals', auth(Role.ADMIN), AdminController.getAllRentals);

export const AdminRoutes = router;