import employees from '../model/employees.json' with { type: 'json' };
import express from 'express';
type Request = express.Request;
type Response = express.Response;

interface Employee {
    id: number,
    firstname: string,
    lastname: string
};

const data: { employees: Employee[], setEmployees(data: Employee[]): void } = {
    employees: [],
    setEmployees: function (data: Employee[]) { this.employees = data; }
};
data.setEmployees(employees);

/**
 * Get all employees
 * @returns {Response} parsed JSON response
 */
export const getAllEmployees = (req: Request, res: Response): Response => {
    return res.json(data.employees);
}

/**
 * Create new employee
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @return {400} 400 status code and message if first and last name is not supplied 
 * @return {201} 201 status code with parsed JSON response
 */
export const createNewEmployee = (req: Request, res: Response): Response => {
    const lastId = data.employees[data.employees.length - 1]?.id;
    const newEmployee = {
        id: lastId? lastId + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message': 'First and last name are required.' });
    }
    data.setEmployees([...data.employees, newEmployee]);
    return res.status(201).json(data.employees);
}

/**
 * Update an employee
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns <Response> Response with parsed JSON
 * ### Status codes:
 * - 400 status code and message if employee not found
 * - 200 status code with parsed JSON response
 */
export const updateEmployee = (req: Request, res: Response):Response => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if ( !employee ) {
        return res.status(400).json({ 'message': `Employee ID ${req.body.id} not found` });
    }
    if ( req.body.firstname ) employee.firstname = req.body.firstname;
    if ( req.body.lastname ) employee.lastname = req.body.lastname;
    const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedEmployees = [...filteredEmployees, employee];
    data.setEmployees(unsortedEmployees.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    return res.json(data.employees);
}

/**
 * Delete an employee
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * ### Status codes:
 * @return {400} 400 status code and message if employee is not found 
 * @return {200} 200 status code with parsed JSON response
 */
export const deleteEmployee = (req: Request, res: Response):Response => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if ( !employee ) {
        return res.status(400).json({ 'message': `Employee ID ${req.body.id} not found` });
    }
    const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredEmployees]);
    return res.json(data.employees);
}

/**
 * Get an employee
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @returns {Response} JSON response of new employees
 * ### Status codes:
 * - 400 status code and message if employee is not found by the supplied id 
 * - 200 status code with parsed JSON response
 */
export const getEmployee = (req: Request, res: Response): Response => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if ( !employee ) {
        return res.status(400).json({ 'message': `Employee ID ${req.body.id} not found` });
    }
    return res.json(employee);
};