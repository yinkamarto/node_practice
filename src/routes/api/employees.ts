import express from 'express';
import { 
    getAllEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee
} from '../../controllers/employeesController.ts';
import { RolesList } from '../../config/roles_list.ts';
import { verifyRoles } from '../../middleware/verifyRoles.ts';

export const router = express.Router();


router.route('/')
    .get(getAllEmployees)
    .post(verifyRoles(RolesList.Admin, RolesList.Editor), createNewEmployee)
    .put(verifyRoles(RolesList.Admin, RolesList.Editor), updateEmployee)
    .delete(verifyRoles(RolesList.Admin), deleteEmployee);

router.route('/:id')
    .get(getEmployee)