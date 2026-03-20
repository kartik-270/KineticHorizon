import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Webhook for Stripe (Must be BEFORE authenticate middleware)
router.post('/webhook', subscriptionController.handleWebhook);

router.use(authenticate);

router.post('/checkout', subscriptionController.createCheckoutSession);
router.post('/cancel', subscriptionController.cancelSubscription);
router.get('/status', subscriptionController.getStatus);
router.get('/sync', subscriptionController.syncSubscription);

export default router;
