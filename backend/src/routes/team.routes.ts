import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import { requireTeamMembership } from 'src/middleware/team-auth.middleware';
import { TeamController } from 'src/controllers/team.controller';
import { requireAdmin } from 'src/middleware/role.middleware';

const router = Router();

router.get('/', verifyJWT, TeamController.getAllTeams);
router.post('/', verifyJWT, requireAdmin, TeamController.createTeam);
router.post(
  '/:teamId/members',
  verifyJWT,
  requireTeamMembership('admin'),
  TeamController.addMember,
);
router.get(
  '/:teamId/assets',
  verifyJWT,
  requireTeamMembership('member'),
  TeamController.getTeamAssets,
);

export default router;
