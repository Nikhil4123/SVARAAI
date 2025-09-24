import { Router } from 'express';
import { createTask, getTasksByProject, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createTask);
router.get('/project/:projectId', authenticate, getTasksByProject);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

export default router;