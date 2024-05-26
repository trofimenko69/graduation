import cors from 'cors';

// Предоставляем доступ cors
export default cors({
    credentials: true,
    origin: [],
    exposedHeaders: '*',
});