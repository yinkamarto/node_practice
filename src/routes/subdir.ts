import express from 'express';
import path from 'path';
const router = express.Router();
import { getDirName } from '../lib/util.ts';

const __dirname = getDirName(import.meta.url)

router.get('/{index{.html}}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

router.get('/test{.html}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
});

export { router };