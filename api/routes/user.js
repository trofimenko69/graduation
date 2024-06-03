
import  {Router} from 'express'
import {asyncRoute} from "../utils/errors.js";
import userCtrl from '../controllers/user.js'
import verify from '../middlewares/verify-token.js'
import roles from '../config/roles.json' assert { type: "json" };

const router=new Router()

router.use(verify.general)


router.route('/self').get(asyncRoute(verify.user([roles.DEFAULT, roles.ADMIN_SYSTEM])),asyncRoute(userCtrl.self))
router.route('/').patch(asyncRoute(userCtrl.update))


export default router