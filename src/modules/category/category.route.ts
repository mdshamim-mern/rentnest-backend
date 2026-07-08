import express from 'express';
import { CategoryController } from './category.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

// শুধুমাত্র অ্যাডমিন ক্যাটাগরি বানাতে পারবে
router.post('/', auth(Role.ADMIN), CategoryController.createCategory);

// সবাই ক্যাটাগরি দেখতে পারবে
router.get('/', CategoryController.getAllCategories);

export const CategoryRoutes = router;