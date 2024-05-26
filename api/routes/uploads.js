import { Router } from 'express';
import { asyncRoute } from '../utils/errors';
import verify from '../middlewares/verify-token.js';
import uploadsCtrl from '../controllers/uploads.js';

const router = Router();

router.use(asyncRoute(verify.general));

router
    .route('/')
    .post(asyncRoute(verify.user), uploadsCtrl.uploader, asyncRoute(uploadsCtrl.afterUpload))






export default router;