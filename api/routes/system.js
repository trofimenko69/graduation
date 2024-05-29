
import systemCtrl from '../controllers/system.js'
import { asyncRoute } from '../utils/errors.js'
import {Router} from "express";
import verify from '../middlewares/verify-token.js'
import roles from '../config/roles.json' assert { type: "json" };
const router=new Router()

router.route('/landing').get(verify.user([roles.ADMIN_SYSTEM]),asyncRoute(systemCtrl.landing))

export default router