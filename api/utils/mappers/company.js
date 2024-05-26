
import cdnUrl from '../cdn-url.js';

export default user => ({
    ...map(user),

    inn: user.inn,
    kpp: user.kpp,

});

// формирует объект с описанием компании без информации о руководителе, для ответа

export function map(user, studentId) {
    return {
        id: user.id,

        name: user.name,
        description: user.description,
        logo: user.logo ? cdnUrl('company', user.id) : null,

        phone: user.phone,
        address: user.address,
        area: user.area,
        size: user.size,

    };
}