import crypto from 'crypto'
export default (howMany = 12, chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789') => {
    const rnd = crypto.randomBytes(howMany),
        value = [],
        len = Math.min(256, chars.length),
        d = 256 / len;

    for (let i = 0; i < howMany; i++) {
        value[i] = chars[Math.floor(rnd[i] / d)];
    }

    return value.join('');
}