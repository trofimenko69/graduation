import cdnUrl from '../cdn-url.js';

export function map(user, studentId) {
    return {
        fio: user.fio,
        experience: user.experience,
        directions: user.directions,
        description: user.description,
        logo: user.logo ? cdnUrl('company', user.id) : null,
    };
}