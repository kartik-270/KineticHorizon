import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import scoreRoutes from './routes/score.routes';
import charityRoutes from './routes/charity.routes';
import subscriptionRoutes from './routes/subscription.routes';
import drawRoutes from './routes/draw.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

app.use(cors());

// Special raw body parser for Stripe webhooks (must be BEFORE express.json())
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

export default app;
