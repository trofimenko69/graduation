
import systemCtrl from '../controllers/system.js'
import { asyncRoute } from '../utils/errors.js'
import {Router} from "express";

const router=new Router()

router.route('/landing').get(asyncRoute(systemCtrl.landing))
