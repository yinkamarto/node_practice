import express from 'express';
import bcrypt from 'bcrypt';
import users from '../model/users.json' with { type: 'json' };
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import fsPromises from 'fs/promises';
import path from 'path';
import { generateRandomSecret } from '../lib/util.ts';
import { getDirName } from '../lib/util.ts';

const __dirname = getDirName(import.meta.url)
dotenv.config();

type Request = express.Request;
type Response = express.Response;
type JwtPayload = jwt.JwtPayload;
type Secret = jwt.Secret;

export interface User {
    id: number,
    username: string,
    password: string,
    refreshToken?: string
}

export interface UserPayload extends JwtPayload {
    _id: string;
    username: string;
}

const usersDB: { users: User[], setUsers(data: User[]): void } = {
    users: users,
    setUsers: function ( data: User[] ) { this.users = data }
}

// TODO Generated secret needs to be stored in secrets manager
const ACCESS_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET?.toString() || generateRandomSecret();
const REFRESH_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET?.toString() || generateRandomSecret();

export const handleLogin = async (req:Request, res:Response) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required!' });
    const foundUser = usersDB.users.find(user => user.username === username);
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // Check password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const payLoad: UserPayload = { '_id': foundUser.id.toString(), 'username': foundUser.username }
        // create JWTs
        const accessToken = jwt.sign(
            payLoad,
            ACCESS_SECRET,
            { expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            payLoad,
            REFRESH_SECRET,
            { expiresIn: '1d'}
        );
        // Save refresh token with current user
        const otherUsers = usersDB.users.filter(user => user.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        // send refresh token as http only(unavailable to javascript)
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000, secure: true });
        res.json({ accessToken }); // Should only be in memory which expires momentarily
        console.log({ 'success': `User ${username} is logged in!` });
    } else {
        res.sendStatus(401);
    }
}