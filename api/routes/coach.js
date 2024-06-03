import {asyncRoute} from "../utils/errors.js";
import coachCtrl from "../controllers/coach.js";
import verify from '../middlewares/verify-token.js';
import Router from "express";

const router=new Router()


router.route('/')
    .post(verify.company,
        asyncRoute(coachCtrl.appendCoach))

router.route('/:coachId')
    .patch(verify.company,
        asyncRoute(coachCtrl.updateCoach))
    .delete(verify.company,
        asyncRoute(coachCtrl.destroyCoach))

export default router