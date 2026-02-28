import express from 'express';
import { handleRefreshToken } from '../controllers/refreshTokenController.ts';
export const router = express.Router();

router.get('/', handleRefreshToken);