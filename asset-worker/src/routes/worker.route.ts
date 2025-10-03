import { Router } from 'express';
import { getMetrics } from '../controllers/worker.controller';
import { getHealth } from '../controllers/health.controller';

const router = Router();

router.route('/api/health').get(getHealth);

router.route('/metrics').get(getMetrics);

export default router;
