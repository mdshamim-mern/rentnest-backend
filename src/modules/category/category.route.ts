import express from 'express';
import { CategoryController } from './category.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', auth(Role.ADMIN), CategoryController.createCategory);

router.get('/', CategoryController.getAllCategories);

export const CategoryRoutes = router;
