
import Router from 'express'
import {asyncRoute} from "../utils/errors.js";
import scheduleCtrl from '../controllers/schedule.js'
const router=new Router()


router.route('/:workout/create')
    .post(asyncRoute(scheduleCtrl.appendWorkout))

