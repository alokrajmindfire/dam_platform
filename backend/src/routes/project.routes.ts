import { Router } from 'express';
import {
  createProject,
  getProjectsByTeam,
} from '../controllers/project.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { requireAdmin } from 'src/middleware/role.middleware';

const router = Router();

router.post('/', verifyJWT, requireAdmin, createProject);
router.get('/team/:teamId', verifyJWT, requireAdmin, getProjectsByTeam);

export default router;
