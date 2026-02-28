import express from 'express';
import { handleLogout } from '../controllers/logoutController.ts';
export const router = express.Router();

router.get('/', handleLogout);