import { Router } from 'express';
import * as drawController from '../controllers/draw.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes (published results)
router.get('/latest', drawController.getLatestDraw);
router.get('/history', drawController.getDrawHistory);

// Admin routes
router.post('/simulate', authenticate, authorize(['ADMIN']), drawController.simulateDraw);
router.post('/publish', authenticate, authorize(['ADMIN']), drawController.publishDraw);

export default router;
