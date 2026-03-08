import express from 'express';

import { inLocalDev } from '../lib/util.ts';
import { User } from '../model/user.ts';

type Request = express.Request;
type Response = express.Response;


export const handleLogout  = async (req:Request, res:Response) => {
    // TODO: On client, also delete the access Token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Is refresh token in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: !inLocalDev() });
        return res.sendStatus(403); // Forbidden
    }
    try {
        // Delete refresh token in db
        foundUser.refreshToken = '';
        const result = await foundUser.save();
        console.log(result);
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: !inLocalDev() });
        res.sendStatus(204);
    } catch ( err ) {
        console.error(err);
        return res.sendStatus(500);
    }
}
