import express from 'express';

import { RolesList } from '../../config/roles_list.ts';
import {
    createNewEmployee,
    deleteEmployee,
    getAllEmployees,
    getEmployee,
    updateEmployee} from '../../controllers/employeesController.ts';
import { verifyRoles } from '../../middleware/verifyRoles.ts';

export const router = express.Router();


router.route('/')
    .get(getAllEmployees)
    .post(verifyRoles(RolesList.Admin, RolesList.Editor), createNewEmployee)
    .put(verifyRoles(RolesList.Admin, RolesList.Editor), updateEmployee)
    .delete(verifyRoles(RolesList.Admin), deleteEmployee);

router.route('/:id')
    .get(getEmployee)
