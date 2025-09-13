import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import multer from 'multer';
import {
  deleteAsset,
  getAssets,
  getAssetsId,
  updateAssetsDownloadCount,
  uploadAssets,
} from '../controllers/assets.controller';

const allowedExt = [
  '.jpeg',
  '.jpg',
  '.png',
  '.webp',
  '.mp4',
  '.mov',
  '.avi',
  '.mkv',
  '.pdf',
];

const allowedMime = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'application/pdf',
];
const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (_, file, cb) => {
    const ext = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf('.'));
    const isExtAllowed = allowedExt.includes(ext);
    const isMimeAllowed = allowedMime.includes(file.mimetype);

    if (isExtAllowed && isMimeAllowed) {
      cb(null, true);
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
router.route('/download/:id').patch(verifyJWT, updateAssetsDownloadCount);
router.route('/:id').delete(verifyJWT, deleteAsset);

export default router;
