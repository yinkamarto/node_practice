// import { NextFunction, Request, Response } from "express";
import express from 'express';
type NextFunction = express.NextFunction;
type Request = express.Request;
type Response = express.Response;
import { logEvents } from './logEvents.ts';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).send(err.message);
}