import express from 'express';
import { ContactController } from './contact.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', ContactController.createMessage);
router.get('/', auth(Role.ADMIN), ContactController.getAllMessages);
router.patch('/:id/read', auth(Role.ADMIN), ContactController.updateMessageStatus);
router.delete('/:id', auth(Role.ADMIN), ContactController.deleteMessage);

export const ContactRoutes = router;