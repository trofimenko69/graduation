import Company from "../models/company.js";
import {AppErrorMissing} from "../utils/errors.js";
import Mark from "../models/mark.js";
import User from "../models/user.js";
import roles from "../config/roles.json" assert { type: "json" };

export default {
    async landing(req, res) {
        const [companies, marksCount,admins] = await Promise.all([
                Company.count(),
                Mark.count(),
                User.findAll({
                    attributes: ['fio', 'login', 'phone'],
                    where:{ role: roles.ADMIN_SYSTEM }
                })
            ]
        )
        if (!companies) throw new AppErrorMissing('companies')

        res.json({
            meta: {
                marks: marksCount,
                companies
            },
            admins: admins,
        })
    }
}