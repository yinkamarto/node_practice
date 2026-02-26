
import cors from 'cors';
type CorsOptions = cors.CorsOptions;

// Cross Origin Resource Sharing (can be used for domains that can access the route like front end or something similar)
const whiteList = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:8000'
];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!whiteList.includes(String(origin)) || !origin) { //remove !origin in production
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}