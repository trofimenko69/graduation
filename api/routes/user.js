
import  {Router} from 'express'
import {asyncRoute} from "../utils/errors.js";
import userCtrl from '../controllers/user.js'
import verify from '../middlewares/verify-token.js'
const router=new Router()

router.use(verify.general)

router.route('/').get(asyncRoute(userCtrl.getAll))

router.route('/self').get(asyncRoute(userCtrl.self))

router.route('/:userId').get(asyncRoute(userCtrl.update))