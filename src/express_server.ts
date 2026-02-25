import express from 'express';
import path from 'path';
import cors from 'cors';
import { logger } from './middleware/logEvents.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { fileURLToPath } from "url";
import { router as indexRouter } from './routes/root.ts';
import { router as subdirRouter } from './routes/subdir.ts';
import { router as employeesRouter } from './routes/api/employees.ts';
type CorsOptions = cors.CorsOptions;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('test', __dirname);

const app = express();
const PORT = process.env.PORT || 8000;

// custom middleware
app.use(logger);

// Cross Origin Resource Sharing (can be used for domains that can access the route like front end or something similar)
const whiteList = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:8000'];
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!whiteList.includes(String(origin)) || !origin) { //remove !origin in production
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// built-in middleware to encode data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/subdir', subdirRouter);
app.use('/employees', employeesRouter);

app.all('*splat', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if (req.accepts('json')) {
        res.json({ error: '404 not found'});
    } else {
        res.type('txt').send('404 not found');
    }
});

app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));