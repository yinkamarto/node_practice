import express from 'express';
import jwt from 'jsonwebtoken';

import { type UserPayload } from '../controllers/authController.ts';
import { generateRandomSecret } from '../lib/util.ts';
type NextFunction = express.NextFunction;
type Request = express.Request;
type Response = express.Response;
type Secret = jwt.Secret;

const ACCESS_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET?.toString() || generateRandomSecret();

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('authorization') || req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required: Invalid Authorization header format (expected "Bearer <token>")' });
    const token = String(authHeader.split(' ')[1]);

    try {
        // jwt.verify returns the decoded payload if valid, or throws an error if not
        const decoded = jwt.verify(token, ACCESS_SECRET) as UserPayload;
        console.log(decoded);
        req.user = decoded;
        // Proceed to the next middleware or route handler
        next();
    } catch ( err ) {
        // Handle invalid or expired tokens
        console.error(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}
