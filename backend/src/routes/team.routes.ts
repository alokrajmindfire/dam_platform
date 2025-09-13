import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import {
  addMember,
  createTeam,
  getAllTeams,
  getTeamMembers,
} from '../controllers/team.controller';

const router = Router();

router.get('/', verifyJWT, getAllTeams);
router.post('/', verifyJWT, requireAdmin, createTeam);
router.post('/:teamId/members', verifyJWT, requireAdmin, addMember);
router.get('/:teamId/members', verifyJWT, requireAdmin, getTeamMembers);
export default router;
