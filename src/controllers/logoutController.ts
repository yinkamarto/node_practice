import express from 'express';
import users from '../model/users.json' with { type: 'json' };
import type { User } from './authController.ts';
import path from 'path';
import fsPromises from 'fs/promises';
import { getDirName } from '../lib/util.ts';

const __dirname = getDirName(import.meta.url)

type Request = express.Request;
type Response = express.Response;

const usersDB: { users: User[], setUsers(data: User[]): void } = {
    users: users,
    setUsers: function ( data: User[] ) { this.users = data }
}

export const handleLogout  = async (req:Request, res:Response) => {
    // TODO: On client, also delete the access Token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Is refresh token in db?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken) as User;
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        return res.sendStatus(403); // Forbidden
    }
    try {
        // Delete refresh token in db 
        const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
        const currentUser = { ...foundUser, refreshToken: '' };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        res.sendStatus(204);
    } catch ( err ) {
        console.error(err);
        return res.sendStatus(500);
    }
}