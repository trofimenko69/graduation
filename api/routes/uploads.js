import { Router } from 'express';
import { asyncRoute } from '../utils/errors';
import verify from '../middlewares/verify-token.js';
import uploadsCtrl from '../controllers/uploads.js';
import roles from '../config/roles.json' assert { type: "json" }
const router = Router();

router.use(asyncRoute(verify.general));

router
    .route('/')
    .post(verify.combine(verify.general,  verify.company,verify.user([roles.DEFAULT])), uploadsCtrl.uploader, asyncRoute(uploadsCtrl.afterUpload))

export default router;