import { Router } from 'express';
import * as charityController from '../controllers/charity.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', charityController.getCharities);
router.get('/featured', charityController.getFeaturedCharity);
router.get('/:id', charityController.getCharityById);

router.post('/select', authenticate, charityController.selectCharity);
router.post('/percentage', authenticate, charityController.updateCharityPercentage);
router.post('/:id/donate', authenticate, charityController.donateToCharity);

export default router;
