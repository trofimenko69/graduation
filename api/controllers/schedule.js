import Workout from "../models/workout.js";
import {AppErrorAlreadyExists, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import Coach from "../models/coach.js";


export default {
    async appendWorkout({ body:{ date, time, duration, type, leisurePlaces, coachId }, company}, res){
        if(!date) throw new AppErrorMissing('date')
        if(!time) throw new AppErrorMissing('time')
        if(!duration) throw new AppErrorMissing('duration')
        if(!type) throw new AppErrorMissing('type')
        if(!leisurePlaces) throw new AppErrorMissing('leisurePlaces')
        if(!coachId) throw new AppErrorMissing('coachId')


        const coach=await Coach.findOne({
            where: {
                id: coachId,
                companyId: company.id
            }
        })

        if(!coach) throw new AppErrorNotExist('coach')
        const workout=await Workout.findOne({
            where: {
                date: date,
                time: time,
                coachId: coachId
            }
        })

        if(workout) throw new AppErrorAlreadyExists('workout')

        await Workout.create({
            date: date,
            time: time,
            duration: duration,
            type: type,
            leisurePlaces: leisurePlaces,
            companyId: company.id,
            coachId: coachId
        })

        res.json({ status: 'Ok' })
    },

    async update({params: { workoutId }, body:{ date, time, duration, type, leisurePlaces, coachId }, company}, res){

        if(!date) throw new AppErrorMissing('date')
        if(!time) throw new AppErrorMissing('time')
        if(!duration) throw new AppErrorMissing('duration')
        if(!type) throw new AppErrorMissing('type')
        if(!leisurePlaces) throw new AppErrorMissing('leisurePlaces')
        if(!coachId) throw new AppErrorMissing('coachId')

        const workout=await Workout.findByPk(workoutId)
        if(!workout) throw new AppErrorNotExist('workout')

        const checkWorkout=await Workout.findOne({
            where:{ date: date, time: time, coachId: coachId}
        })

        if(checkWorkout) throw  new AppErrorAlreadyExists('workout')

        await workout.update({
            date,time,duration, type,leisurePlaces, coachId
        })

        res.json({ status: 'Ok' })
    }

}