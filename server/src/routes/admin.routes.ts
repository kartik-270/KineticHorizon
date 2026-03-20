import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));

// User Management
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Charity Management
router.post('/charities', adminController.createCharity);
router.put('/charities/:id', adminController.updateCharity);
router.delete('/charities/:id', adminController.deleteCharity);

// Winner Management
router.get('/winners', adminController.getWinners);
router.post('/winners/:id/verify', adminController.verifyWinner);

export default router;
