import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/verify', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.get('/me', authController.getMe);

export default router;
