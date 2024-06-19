import { Router } from 'express';
import authCtrl from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors';

const router = Router();

/*
 * Роут на логирование студента
 */
router.route('/registration').patch(asyncRoute(authCtrl.checkEmail)).post(asyncRoute(authCtrl.registration));

router.route('/login').post(asyncRoute(authCtrl.login));

router.route('/reset').post(asyncRoute(authCtrl.checkCode)).patch(asyncRoute(authCtrl.resetPassword));

export default router;
