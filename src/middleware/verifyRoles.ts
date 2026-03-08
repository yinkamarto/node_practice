import express from 'express';

import { type RolesListType } from '../config/roles_list.ts';
type NextFunction = express.NextFunction;
type Request = express.Request;
type Response = express.Response;

export const verifyRoles = (...allowedRoles: RolesListType[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(JSON.stringify(req.user));
        if (!req.user?.roles) return res.status(401).json({ message: `User ${req.user?.username} does not have permissions for this action.` });
        const rolesArray = [...allowedRoles];
        console.log('Allowed roles', rolesArray);
        console.log('User roles: ', req.user.roles);
        const result = req.user.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}
