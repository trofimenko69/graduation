import jwt from '../utils/jwt.js';
import { SystemError, AppErrorForbiddenAction, AppErrorInvalid, asyncRoute } from '../utils/errors.js';
import User from "../models/user.js";
import Company from "../models/company.js";

async function general(req, res, next) {
    const authorization = req.cookies['auth._token.user'];
    if (authorization?.split(' ')[0] !== 'Bearer') throw new AppErrorInvalid('token', 401);

    try {
        req.user = jwt.verify(authorization.split(' ')[1]);
    } catch (e) {
        console.log(e);
        throw new AppErrorInvalid('token', 401);
    }
    next();
}

function verifyUser(roles){
    if(!roles) throw new SystemError('roles')
    return async (req,res,next)=>{
        const user=await User.findByPk(req.user.id)
        if(!user || !user.role) throw new AppErrorInvalid('token',401)
        if(!roles.includes(user.role)) throw new AppErrorForbiddenAction()
        req.user=user;
        next()
    }
}
async function verifyCompany(req,res,next){
    const authorization = req.cookies['auth._token.company'];
    // проверка наличие токена
    if (authorization?.split(' ')[0] !== 'Bearer') throw new AppErrorInvalid('token', 401);

    // проверка токена на валидность
    try {
        req.user = jwt.verify(authorization.split(' ')[1]);
    } catch (e) {
        console.log(e);
        throw new AppErrorInvalid('token', 401);
    }
    // получение компании по id из запроса
    const company = await Company.findByPk(req.user.id);
    if (!company) throw new AppErrorInvalid('token', 401);

    // добавление компании в запрос и прокидывание запроса дальше
    req.company = company;
    next();
}
function combine(...verifications) {
    return asyncRoute(async (req, res, next) => {
        const results = await Promise.all(
            verifications.map(v =>
                v(req, res, () => {}).then(
                    () => 1,
                    () => undefined
                )
            )
        );

        if (results.filter(Boolean).length) next();
        else throw new AppErrorForbiddenAction();
    });
}
export default {
    general,
    user: verifyUser,
    combine
}