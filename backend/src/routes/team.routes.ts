import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
// import { requireTeamMembership } from '../middleware/team-auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import {
  addMember,
  createTeam,
  getAllTeams,
  getTeamAssets,
  getTeamMembers,
} from '../controllers/team.controller';

const router = Router();

router.get('/', verifyJWT, getAllTeams);
router.post('/', verifyJWT, requireAdmin, createTeam);
router.post(
  '/:teamId/members',
  verifyJWT,
  // requireTeamMembership('admin'),
  addMember,
);
router.get(
  '/:teamId/assets',
  verifyJWT,
  // requireTeamMembership('member'),
  getTeamAssets,
);
router.get(
  '/:teamId/members',
  verifyJWT,
  // requireTeamMembership('member'),
  getTeamMembers,
);
export default router;
