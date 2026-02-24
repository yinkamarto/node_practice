const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 8000;

// custom middleware
app.use(logger);

// Cross Origin Resource Sharing (can be used for domains that can access the route like front end or something similar)
const whiteList = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:8000'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) { //remove !origin in production
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

app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));

// Route handler
app.get(/\/hello(.html)?/, (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
}, (req, res) => {
    res.send('Hello World!');
});

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