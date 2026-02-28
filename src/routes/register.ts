import express from 'express';
import { handleNewUser } from '../controllers/registerController.ts';
import { errorHandler } from '../middleware/errorHandler.ts';
import { logger } from '../middleware/logEvents.ts';
export const router = express.Router();

router.use(logger);
router.post('/', handleNewUser);

router.use(errorHandler);