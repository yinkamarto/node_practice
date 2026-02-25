import express from 'express';
// import { Request, Response } from 'express';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
type NextFunction = express.NextFunction;
type Request = express.Request;
type Response = express.Response;

import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('test', __dirname);



const logEvents = async (message: string, logName: string) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
            fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
        }
        // testing
        await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', logName), logItem);
    } catch (err){
        console.log(err);
    }
}

const logger = (req: Request, res: Response, next: NextFunction) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

export { logger, logEvents };