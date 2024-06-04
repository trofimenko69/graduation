import subCtrl from '../controllers/subscription.js'
import { asyncRoute } from '../utils/errors.js'
import verify from '../middlewares/verify-token.js'
import roles from '../config/roles.json' assert { type: "json" };
import {Router} from "express";

const router=new Router()

router.route('/')
    .post(verify.company, asyncRoute(subCtrl.create))

router.route('/design')
    .post(verify.general,asyncRoute(subCtrl.design))

router.route('/:subscriptionId/freeze')
    .patch(verify.general, asyncRoute(subCtrl.freeze))


router.route('/:subscriptionId/defrost')
    .patch(verify.general,asyncRoute(subCtrl.defrost))


export default router