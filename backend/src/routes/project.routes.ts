import { Router } from 'express';
import {
  createProject,
  getProjectsByTeam,
} from '../controllers/project.controller';
import { verifyJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/', verifyJWT, createProject);
router.get('/team/:teamId', verifyJWT, getProjectsByTeam);

export default router;
