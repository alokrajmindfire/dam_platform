import { Router } from 'express';

import {
  getPublicUsers,
  updateProfileVisibility,
} from '../controllers/user.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { requireAdmin } from 'src/middleware/role.middleware';

const router = Router();

router.get('/users/public', verifyJWT, requireAdmin, getPublicUsers);

router.patch('/users/visibility', verifyJWT, updateProfileVisibility);

export default router;
