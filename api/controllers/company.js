import Company from "../models/company.js";
import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
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
import jwt from "../utils/jwt.js";
import User from "../models/user.js";
import Agreement from "../models/agreement.js";

export default {

    async login({body: {login, password} },res){
        const company=await Company.findOne({
            where: { login }
        })
        if(!await company.validatePassword(password)) throw new AppErrorInvalid('password')
        const { jwt: token } = jwt.generate({ id: company.id });
        res.json({user: company, token})
    },

    async get({ query, user }, res){
        const {
            search,
            filters: { coast, size, area, address },
        } = prepareParams(query, {
            allowedFilters: {
                coast: Number,
                size: v => (Array.isArray(v) ? v.map(Number) : [Number(v)]),
                area: v => (Array.isArray(v) ? v.map(Number) : [Number(v)]),
                address: str => (Array.isArray(str) ? str : [str]),
            },
        });

       const companies = await Company.findAll({
            order: ['name'],
            ...(search && {
                where: {
                    [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { name: { [Op.iLike]: `%${search}%` } }],
                },
            }),
           ...(coast && { where: { [Op.between]: [0, coast]} }),
           ...(size && { where : { size:  { [Op.gte]: size }}}),
           ...(area && { where: { area: area }}),
           ...(address && {where: { address: {[Op.iLike]: `%${address}%`} }})
        });

       const coaches=await Coach.findAll()

        const filtersSize = []
        const filtersArea = []

        filtersSize.push(...[...new Set(companies.map(c=>c.size))].filter(Boolean))
        filtersArea.push(...[...new Set(companies.map(c=>c.area))].filter(Boolean))

        res.json({
            companies: companies,
            filters:{
                size: filtersSize,
                area: filtersArea,
                coast:coast
            },
            coaches: coaches,
        })
    },

    async self({ company }, res) {
         company.coaches = await Coach.findAll({
            where:{
                companyId: company.id
            }
        });
        res.json({company: prepareCompany(company)})
    },


    async getById({params: { companyId }, user}, res) {

        const company = await Company.findByPk(companyId, {
            include:
                [{
                model: Coach,
                as: 'coaches',
                required: false,
                },
                {
                model: Mark,
                as: 'marks',
                required: false,
                }]
        });
        if (!company) throw new AppErrorNotExist('company');

        company.marks.sort((m)=>m.userId === user.id)
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

    },

    async statistics({params: { companyId }}, res ){


        const [{count, rows,coaches, users}]=await Promise.all([
            Mark.findAndCountAll({
                where: {
                    companyId: companyId,
                }
            }),
            Coach.count({
            where: {
                companyId: companyId
            }
        }),
            User.count({
                include: {
                    model: Agreement,
                    as: 'agreements',
                    required: true,
                    include: {
                        model : Company,
                        as: 'company',
                        required: true,
                        where: {
                            id: companyId
                        }
                    }
                },
            })
        ])



        const data = { marks: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, diagram: {} };
        for (const c of rows) data.marks[c.mark]++;
        for (let i = 5; i > 0; i--) data.diagram[i] = Math.round((data.marks[i] / count) * 100);

        res.json({
            countCoach: coaches,
            mark: data,
            usersCount: users
        })
    }

}