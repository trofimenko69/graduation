

import Router from 'express'
import {asyncRoute} from "../utils/errors.js";
import companyCtrl from '../controllers/company.js'
const router=new Router()



router.route('/')
    .get(asyncRoute(companyCtrl.get))
    .post(asyncRoute(companyCtrl.create))

router.route('/self')
    .get(asyncRoute(companyCtrl.self))


router.route('/append')
    .post(asyncRoute(companyCtrl.appendCoach))

router.route('/:companyId')
    .get(asyncRoute(companyCtrl.getById))
    .patch(asyncRoute(companyCtrl.update))
    .delete(asyncRoute(companyCtrl.destroy))

router.route('/:companyId/marks')
    .post(asyncRoute(companyCtrl.createMark))

router.route('/:companyId/schedule')
    .get(asyncRoute(companyCtrl.schedule))

router.route('/:coachId')
    .patch(asyncRoute(companyCtrl.updateCoach))
    .delete(asyncRoute(companyCtrl.destroyCoach))

//
// router.route('/:companyId/subscriptions').get(asyncRoute(companyCtrl.getById))


