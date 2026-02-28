import express from 'express';
import path from 'path';
const router = express.Router();
import { getDirName } from '../lib/util.ts';

const __dirname = getDirName(import.meta.url)

// Can use regex /^\/$|\/index(.html)?/ or '/{index{.html}}'
router.get('/{index{.html}}', (req, res) => {
    // res.send('Hello World');/{index{.html}}
    // res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/new-page{.html}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page{.html}', (req, res) => {
    res.redirect(301, '/new-page.html'); //302 by default
});

export { router };