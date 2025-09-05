import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import multer from 'multer';
import {
  getAssets,
  getAssetsId,
  uploadAssets,
} from '../controller/assets.controller';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

router
  .route('/upload')
  .post(verifyJWT, upload.array('files', 10), uploadAssets);
router.route('/').get(verifyJWT, getAssets);
router.route('/:id').get(verifyJWT, getAssetsId);

export default router;
