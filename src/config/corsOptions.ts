
import cors from 'cors';
import { allowedOrigins } from './allowedOrigins.ts';
type CorsOptions = cors.CorsOptions;

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!allowedOrigins.includes(String(origin)) || !origin) { //remove !origin in production
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}