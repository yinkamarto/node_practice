import express from 'express';

import { Employee } from '../model/employee.ts';


type Request = express.Request;
type Response = express.Response;

interface Employee {
    id: number,
    firstname: string,
    lastname: string
};



/**
 * Get all employees
 * @returns {Response} parsed JSON response
 */
export const getAllEmployees = async (req: Request, res: Response): Promise<Response> => {
    const employees = await Employee.find().exec();
    if(!employees) return res.status(204).json({ 'message': 'No employees found!' });
    return res.json(employees);
}

/**
 * Create new employee
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @return {400} 400 status code and message if first and last name is not supplied
 * @return {201} 201 status code with parsed JSON response
 */
export const createNewEmployee = async (req: Request, res: Response): Promise<Response> => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last name are required.' });
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        return res.status(201).json(result);
    } catch (err) {
        console.log(err);
    }

    return res.status(500).json({ 'message': 'An unexpected error occurred!' });
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
export const updateEmployee = async (req: Request, res: Response):Promise<Response> => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required' });
    }
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ 'message': `No employee matches ID ${req.body.id}` });
    }
    if ( req.body.firstname ) employee.firstname = req.body.firstname;
    if ( req.body.lastname ) employee.lastname = req.body.lastname;
    const result = await employee.save();
    return res.json(result);
}

/**
 * Delete an employee
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * ### Status codes:
 * @return {400} 400 status code and message if employee is not found
 * @return {200} 200 status code with parsed JSON response
 */
export const deleteEmployee = async (req: Request, res: Response):Promise<Response> => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required' });
    };
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ 'message': `No employee matches ID ${req.body.id}` });
    }
    const result = await employee.deleteOne({ _id: req.body.id });
    return res.json(result);
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
export const getEmployee = async (req: Request, res: Response): Promise<Response> => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'ID parameter is required' });
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ 'message': `No employee matches ID ${req.body.id}` });
    }
    return res.json(employee);
};
