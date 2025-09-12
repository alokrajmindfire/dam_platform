import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { verifyJWT } from 'src/middleware/auth.middleware';

const router = Router();

router.post('/', verifyJWT, ProjectController.createProject);
router.get('/team/:teamId', verifyJWT, ProjectController.getProjectsByTeam);

export default router;
