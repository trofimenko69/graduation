import subCtrl from '../controllers/subscription.js'
import { asyncRoute } from '../utils/errors.js'
import {Router} from "express";

const router=new Router()

router.route('/design')
    .get(asyncRoute(subCtrl.design))

router.route('/:subscriptionId/freeze')
    .patch(asyncRoute(subCtrl.freeze))


router.route('/:subscriptionId/defrost')
    .patch(asyncRoute(subCtrl.defrost))

