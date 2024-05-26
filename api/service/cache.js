import { createClient } from 'redis';

// содание redis
const redis = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

redis.on('error', err => console.log('Redis Client Error', err));
redis.on('ready', () => console.log('Cache connected'));

export default redis;

// подключение к redis
export async function initCache() {
    if (!redis.isOpen) await redis.connect();
}