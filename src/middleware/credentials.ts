import express from 'express';
import { allowedOrigins } from '../config/allowedOrigins.ts';
type NextFunction = express.NextFunction;
type Request = express.Request;
type Response = express.Response;

export const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', origin);
    }
    next();
}