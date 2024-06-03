

import Router from 'express'
import {asyncRoute} from "../utils/errors.js";
import companyCtrl from '../controllers/company.js'
import verify from '../middlewares/verify-token.js'
import roles from '../config/roles.json' assert { type: "json" };

const router=new Router()



router.route('/login')
    .post(asyncRoute(companyCtrl.login))

router.route('/')
    .get(asyncRoute(companyCtrl.get))
    .post(verify.general,asyncRoute(verify.user([roles.ADMIN_SYSTEM])),asyncRoute(companyCtrl.create))

router.route('/self')
    .get(verify.company,asyncRoute(companyCtrl.self))

router.route('/:companyId')
    .get(asyncRoute(companyCtrl.getById))
    .patch(verify.company,asyncRoute(companyCtrl.update))
    .delete(verify.general,asyncRoute(verify.user([roles.ADMIN_SYSTEM])),asyncRoute(companyCtrl.destroy))

router.route('/:companyId/marks')
    .post(verify.general,asyncRoute(verify.user([roles.DEFAULT, roles.ADMIN_SYSTEM])), asyncRoute(companyCtrl.createMark))

router.route('/:companyId/schedule')
    .get(asyncRoute(companyCtrl.schedule))

router.route('/:companyId/statistics')
    .get(verify.general, verify.combine(verify.company,asyncRoute(verify.user([roles.ADMIN_SYSTEM]))) , asyncRoute(companyCtrl.statistics))




export default router;