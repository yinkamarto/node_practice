import express from 'express';
import users from '../model/users.json' with { type: 'json' };
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { generateRandomSecret } from '../lib/util.ts';
import type { User, UserPayload } from './authController.ts';
dotenv.config();

type Request = express.Request;
type Response = express.Response;
// type JwtPayload = jwt.JwtPayload;
type Secret = jwt.Secret;

const usersDB: { users: User[], setUsers(data: User[]): void } = {
    users: users,
    setUsers: function ( data: User[] ) { this.users = data }
}

// TODO Generated secret needs to be stored in secrets manager
const ACCESS_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET?.toString() || generateRandomSecret();
const REFRESH_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET?.toString() || generateRandomSecret();

export const handleRefreshToken  = async (req:Request, res:Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken) as User;
    if (!foundUser) return res.sendStatus(403); // Forbidden
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as UserPayload;
        if (foundUser.username !== decoded.username) return res.sendStatus(403);
        const payLoad: UserPayload = { '_id': foundUser.id.toString(), 'username': foundUser.username }
        const accessToken = jwt.sign(
            payLoad,
            ACCESS_SECRET,
            { expiresIn: '30s'}
        );
        res.json({ accessToken });
    } catch ( err ) {
        // Handle invalid or expired tokens
        console.error(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}