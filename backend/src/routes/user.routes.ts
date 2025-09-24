import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);

export default router;