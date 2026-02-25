import express from 'express';
import employees from '../../../data/employees.json' with { type: 'json' };

const router = express.Router();
interface Employee {
    id: number,
    firstname: string,
    lastname: string
}
const data: {employees?: Employee[]} = {};
data.employees = employees;

router.route('/')
    .get((req, res) => {
        res.json(data.employees);
    })
    .post((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .put((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .delete((req, res) => {
        res.json({ "id": req.body.id });
    });

router.route('/:id')
    .get((req, res) => {
        res.json({ "id": req.params.id });
    })

export { router };