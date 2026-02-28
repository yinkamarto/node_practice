import express from 'express';
import { handleLogin } from '../controllers/authController.ts';
export const router = express.Router();

router.post('/', handleLogin);