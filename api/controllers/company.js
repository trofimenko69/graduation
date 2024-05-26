import Company from "../models/company.js";
import {AppErrorAlreadyExists, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import randomPassword from '../utils/generate.js';
import sandEmail from '../service/email.js'

import Coach from "../models/coach.js";
import prepareCompany, {map} from "../utils/mappers/company.js";
import mapMark from "../utils/mappers/mark.js"
import prepareParams from "../utils/prepare-params.js";
import {Op} from "sequelize";
import argon2 from "argon2";
import Mark from "../models/mark.js";
import Workout from "../models/workout.js";

export default {

    async get({ query, user }, res){
        const {
            search,
            filters: { coast, size, area },
        } = prepareParams(query, {
            allowedFilters: {
                coast: Number,
                size: v => (Array.isArray(v) ? v.map(Number) : [Number(v)]),
                area: v => (Array.isArray(v) ? v.map(Number) : [Number(v)]),

            },
        });

       const companies = await Company.findAll({
            order: ['name'],
            ...(search && {
                where: {
                    [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { shortName: { [Op.iLike]: `%${search}%` } }],
                },
            }),
           ...(coast && { where: { [Op.between]: [0, coast]} }),
           ...(size && { where : { size: size }}),
           ...(area && { where: { area: area }})
        });

        const filtersSize = []
        const filtersArea = []

        filtersSize.push(...[...new Set(companies.map(c=>c.size))].filter(Boolean))
        filtersArea.push(...[...new Set(companies.map(c=>c.size))].filter(Boolean))

        res.json({
            companies: companies,
            filters:{
                size: filtersSize,
                area: filtersArea,
                coast:coast
            }
        })
    },

    async self({params: {companyId}, user}, res) {
        const company = await Company.findByPk(companyId, {
            include: {
                model: Coach,
                as: 'coaches',
                required: false,
            }
        });
        if (!company) throw new AppErrorNotExist('company');

        res.json({company: prepareCompany(company)})
    },


    async getById({params: {companyId}, user}, res) {

        const company = await Company.findByPk(companyId, {
            include: {
                model: Coach,
                as: 'coaches',
                required: false,
            }
        });
        if (!company) throw new AppErrorNotExist('company');

        res.json({company: map(company)})

    },

    async update(
        {
            params: { companyId },
            body: { name, description, address, area, size, phone, inn, kpp },
            company
        },
        res)
    {
        if(!name) throw new AppErrorMissing('name')
        if(!description) throw new AppErrorMissing('description')
        if(!address) throw new AppErrorMissing('address')
        if(!area) throw new AppErrorMissing('area')
        if(!size) throw new AppErrorMissing('size')
        if(!phone) throw new AppErrorMissing('phone')
        if(!inn) throw new AppErrorMissing('inn')
        if(!kpp) throw new AppErrorMissing('kpp')

        if(!company) company=await Company.findByPk(companyId)

        await company.update(
            name,
            description,
            address,
            area,
            size,
            phone,
            inn,
            kpp
        )

        res.json({
            status: 'Ok'
        })
    },


    async create({body: { login, name, description, address, area, size,  phone, inn, kpp }}, res){

        if  (!login) throw new AppErrorMissing('login');
        if  (!name) throw new AppErrorMissing('name')
        if  (!description) throw new AppErrorMissing('description')
        if  (!address) throw new AppErrorMissing('address')
        if  (!area) throw new AppErrorMissing('area')
        if  (!size) throw new AppErrorMissing('size')
        if  (!phone) throw new AppErrorMissing('phone')
        if  (!inn) throw new AppErrorMissing('inn')
        if  (!kpp) throw new AppErrorMissing('kpp')

        const checkCompany = await Company.findOne({ where: { [Op.or]: { login, inn }}});
        if (checkCompany) throw new AppErrorAlreadyExists('company');

        const password = randomPassword();
        const company = await Company.create(
            {
                login,
                password: await argon2.hash(password) ,
                name,
                description,
                address,
                area,
                size,
                phone,
                inn,
                kpp
            });

        console.log('New registration:', company.login, password);
        sandEmail(company.login, 'registration', company.login, password);
        res.json({ company: prepareCompany(company) });

    },

    async destroy({params: { companyId } }, res){
        await Company.destroy({ where: { id: companyId } });
        res.json({ status: 'OK' });
    },

   async appendCoach({body: {fio, experience, directions, description, leisurePlaces,phone}, company}, res){

        if(!fio) throw new AppErrorMissing('fio')
        if(!experience) throw new AppErrorMissing('experience')
        if(!directions) throw new AppErrorMissing('directions')
        if(!description) throw new AppErrorMissing('description')
        if(!phone) throw new AppErrorMissing('phone')

        await Coach.create({
            fio,
            experience,
            directions,
            description,
            phone,
            companyId: company.id
        })

       res.json({status: 'Ok'})

   },

   async updateCoach({ params: { coachId }, body: {fio, experience, directions, description, leisurePlaces,phone} }, res) {
       if(!fio) throw new AppErrorMissing('fio')
       if(!experience) throw new AppErrorMissing('experience')
       if(!directions) throw new AppErrorMissing('directions')
       if(!description) throw new AppErrorMissing('description')
       if(!phone) throw new AppErrorMissing('phone')

       const coach=await Coach.findByPk(coachId)
       if(!coach) throw new AppErrorNotExist('coach')

       await coach.update({ fio, experience, directions, description, phone })
       res.json({status: 'Ok'})
   },

   async destroyCoach({params: { coachId } },res){
       await Coach.destroy({ where: { id: coachId } });
       res.json({ status: 'OK' });
   },

    async createMark({ params: { companyId }, body: { mark, text }, user }, res) {
        if (!mark) throw new AppErrorMissing('mark');
        if (!text) throw new AppErrorMissing('text');

        let markInstance = await Mark.scope('info').findOne({
            where: { userId: user.id, companyId },
        });

        if (markInstance) await markInstance.update({ mark, text });
        else {
            markInstance = await Mark.create({
                mark,
                text,
                userId: user.id,
                companyId,
            });

            markInstance = await Mark.scope('info').findByPk(markInstance.id);
        }

        res.json({ mark: mapMark(markInstance) });
    },

    async schedule({  params: { companyId }, user}, res){
        const works=await Workout.findAll({
            where: {
                companyId:companyId,
                order: [['date', 'DESC'], ['time','DESC']],
                leisurePlaces: { [Op.eq] : 0 },
            },
            include:{ model:Coach, as: 'coach',  required: true }
        })


        const schedule= Object.entries((works)
            .sort((a,b)=> a.time - b.time)
            .reduce((acc, cur)=>acc[cur.date].push(cur), [])
            .sort((a,b)=>a.date- b.date)
    )

        res.json(schedule)

    }

}