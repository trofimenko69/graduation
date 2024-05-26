import cdnUrl from '../cdn-url.js';

export default mark => {
    return {
        ...(mark.toJSON?.() ?? mark),

        company: {
            ...(mark.company.toJSON?.() ?? mark.company),
            logo: mark.company.logo ? cdnUrl('company', mark.company.id) : null,
        },

        date: mark.createdAt.valueOf(),

        createdAt: undefined,
        updatedAt: undefined,

        studentId: undefined,
        companyId: undefined,
    };
};