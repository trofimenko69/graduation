
import Router from 'express'
import {asyncRoute} from "../utils/errors.js";
import scheduleCtrl from '../controllers/schedule.js'
import verify from "../middlewares/verify-token.js";
const router=new Router()


router.route('/:workout/create')
    .post(verify.company,
        asyncRoute(scheduleCtrl.appendWorkout))

