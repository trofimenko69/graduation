import subCtrl from '../controllers/subscription.js'
import { asyncRoute } from '../utils/errors.js'
import verify from '../middlewares/verify-token.js'
import {Router} from "express";

const router=new Router()

router.route('/design')
    .get(verify.combine(verify.general, verify.user),asyncRoute(subCtrl.design))

router.route('/:subscriptionId/freeze')
    .patch(verify.combine(verify.general, verify.user), asyncRoute(subCtrl.freeze))


router.route('/:subscriptionId/defrost')
    .patch(verify.combine(verify.general, verify.user),asyncRoute(subCtrl.defrost))

