import { Router } from 'express';
import { createTask, getTasksByProject, updateTask, deleteTask, assignTask, getTasksByAssignee } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createTask);
router.get('/project/:projectId', authenticate, getTasksByProject);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);
router.put('/:id/assign', authenticate, assignTask);
router.get('/assignee/:assigneeId', authenticate, getTasksByAssignee);

export default router;