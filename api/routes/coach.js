import {asyncRoute} from "../utils/errors.js";
import coachCtrl from "../controllers/coach.js";
import verify from '../middlewares/verify-token.js';
import router from "./company.js";

router.route('/')
    .post(verify.combine(verify.general, verify.company),
        asyncRoute(coachCtrl.appendCoach))

router.route('/:coachId')
    .patch(	verify.combine(verify.general, verify.company),
        asyncRoute(coachCtrl.updateCoach))
    .delete(verify.combine(verify.general, verify.company),
        asyncRoute(coachCtrl.destroyCoach))

export default router