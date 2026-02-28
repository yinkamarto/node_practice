import express from 'express';
import path from 'path';
import cors from 'cors';
import { logger } from './middleware/logEvents.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { router as indexRouter } from './routes/root.ts';
import { router as subdirRouter } from './routes/subdir.ts';
import { router as employeesRouter } from './routes/api/employees.ts';
import { router as registerRouter } from './routes/register.ts';
import { router as authRouter } from './routes/auth.ts';
import { router as refreshRouter } from './routes/refresh.ts';
import { router as logoutRouter } from './routes/logout.ts';
import {corsOptions} from './config/corsOptions.ts';
import { verifyJWT } from './middleware/verifyJWT.ts';
import cookieParser from 'cookie-parser';
import { credentials } from './middleware/credentials.ts';
import { getDirName } from './lib/util.ts';

const __dirname = getDirName(import.meta.url)
const app = express();
const PORT = process.env.PORT || 8000;

// custom middleware
app.use(logger);

// Handles options credentials check before CORS and fetch cookies credentials requirement. This is for the frontend client.
app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to encode data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/subdir', subdirRouter);
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);

// Every route after this will need auth
app.use(verifyJWT);
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