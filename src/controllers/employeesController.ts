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

export const getAllEmployees = (req: Request, res: Response) => {
    res.json(data.employees);
}

export const createNewEmployee = (req: Request, res: Response) => {
    const nextId = data.employees[data.employees.length - 1]?.id;
    const newEmployee = {
        id: nextId? nextId + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message': 'First and last name are required.' });
    }
    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);

}
export const updateEmployee = (req: Request, res: Response) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if ( !employee ) {
        return res.status(400).json({ 'message': `Employee ID ${req.body.id} not found` });
    }
    if ( req.body.firstname ) employee.firstname = req.body.firstname;
    if ( req.body.lastname ) employee.lastname = req.body.lastname;
    const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedEmployees = [...filteredEmployees, employee];
    data.setEmployees(unsortedEmployees.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.employees);
}

export const deleteEmployee = (req: Request, res: Response) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if ( !employee ) {
        return res.status(400).json({ 'message': `Employee ID ${req.body.id} not found` });
    }
    const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredEmployees]);
    res.json(data.employees);
}

export const getEmployee = (req: Request, res: Response) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if ( !employee ) {
        return res.status(400).json({ 'message': `Employee ID ${req.body.id} not found` });
    }
    res.json(employee);
};