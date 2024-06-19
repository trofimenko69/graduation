
import cdnUrl from '../cdn-url.js';

export default user => ({
    ...map(user),

    inn: user.inn,
    kpp: user.kpp,

});


export function map(user) {
    return {
        id: user.id,

        name: user.name,
        description: user.description,
        logo: user.logo ? cdnUrl('company', 'logo', user.id) : null,
        phone: user.phone,
        address: user.address,
        area: user.area,
        size: user.size,

    };
}