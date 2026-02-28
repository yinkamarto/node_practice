import express from 'express';
import fsPromises from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import users from '../model/users.json' with { type: 'json' };
import { getDirName } from '../lib/util.ts';

const __dirname = getDirName(import.meta.url)
type Request = express.Request;
type Response = express.Response;

interface User {
    id: number,
    username: string,
    password: string
}

const usersDB: { users: User[], setUsers(data: User[]): void } = {
    users: users,
    setUsers: function ( data: User[] ) { this.users = data }
}

/**
 * Create new User
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Promise<Response>} Promise of Response or undefined
 * 
 * ### Status codes:
 * - 400 status code and message if username or password is not supplied
 * - 409 status code and message if user with that name already exists
 * - 500 status code and message if an error occurs with hashing password or writing to file
 * - 201 status code with parsed JSON response
 */
export const handleNewUser = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;
    if (!username || !password){
        return res.status(400).json({ 'message': 'Username and password is required!' });
    }
    // check for duplicates
    const duplicate = usersDB.users.find(user => user.username === username);
    if (duplicate) {
        console.error(`Duplicate user ${username} found!`);
        return res.status(409).json({ 'failure': `Duplicate user ${username} found!`}); // duplicate entry
    }
    try {
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // store new user
        const lastId = usersDB.users[usersDB.users.length - 1]?.id;
        const newUser = {id: lastId? lastId + 1: 1, username: username, password: hashedPassword};
        usersDB.setUsers([...usersDB.users, newUser]);

        console.log(path.join(__dirname, '..', 'model', 'users.json'));
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));
        console.log(usersDB.users);
    } catch (err: unknown) {
        return res.status(500).json({ 'message': err instanceof Error? err.message : err })
    }
    return res.status(201).json({ 'success': `new user ${username} created!`});
}