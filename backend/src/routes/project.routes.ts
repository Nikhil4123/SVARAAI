import { Router } from 'express';
import { createProject, getProjects, deleteProject } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createProject);
router.get('/', authenticate, getProjects);
router.delete('/:id', authenticate, deleteProject);

export default router;