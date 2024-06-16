import { Router } from 'express';
import { asyncRoute } from '../utils/errors';
import verify from '../middlewares/verify-token.js';
import uploadsCtrl from '../controllers/uploads.js';
import roles from '../config/roles.json' assert { type: "json" }
const router = Router();


router
    .route('/')
    .post(verify.general, verify.company, uploadsCtrl.uploaderLogo, asyncRoute(uploadsCtrl.afterUploadLogo))

router.route('/images')
    .post(verify.company, uploadsCtrl.uploaderImages, asyncRoute(uploadsCtrl.afterUploadImages))

export default router;