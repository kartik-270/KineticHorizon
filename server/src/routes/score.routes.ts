import { Router } from 'express';
import * as scoreController from '../controllers/score.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', scoreController.addScore);
router.get('/', scoreController.getScores);

export default router;
