import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { getDashboardOverview } from '../controllers/dashboard.controller';

const router = Router();

router.get('/overview', verifyJWT, requireAdmin, getDashboardOverview);

export default router;
