import { Router } from 'express';

import {
  getPublicUsers,
  updateProfileVisibility,
} from '../controllers/user.controller';
import { verifyJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/users/public', verifyJWT, getPublicUsers);

router.patch('/users/visibility', verifyJWT, updateProfileVisibility);

export default router;
