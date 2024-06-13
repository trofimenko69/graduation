import {AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import Coach from "../models/coach.js";

export default {
    async appendCoach({body: {fio, experience, directions, description, phone}, company}, res) {

        if (!fio) throw new AppErrorMissing('fio')
        if (!experience) throw new AppErrorMissing('experience')
        if (!directions) throw new AppErrorMissing('directions')
        if (!description) throw new AppErrorMissing('description')
        if (!phone) throw new AppErrorMissing('phone')

        await Coach.create({
            fio,
            experience,
            directions,
            description,
            phone,
            companyId: company.id,
        })

        res.json({status: 'Ok'})

    },

    async updateCoach({
                          params: { coachId },
                          body: { fio, experience, directions, description, phone },
                           company
                      }, res) {
        if (!fio) throw new AppErrorMissing('fio')
        if (!experience) throw new AppErrorMissing('experience')
        if (!directions) throw new AppErrorMissing('directions')
        if (!description) throw new AppErrorMissing('description')
        if (!phone) throw new AppErrorMissing('phone')

        const coach = await Coach.findByPk(coachId,{
            where: {
                companyId: company.id
            }
        })
        if (!coach) throw new AppErrorNotExist('coach')

        await coach.update({fio, experience, directions, description, phone})
        res.json({status: 'Ok'})
    },

    async destroyCoach({params: {coachId}}, res) {
        await Coach.destroy({where: { id: coachId }});
        res.json({status: 'OK'});
    },
}