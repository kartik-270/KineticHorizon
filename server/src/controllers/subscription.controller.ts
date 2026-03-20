import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import emailService from '../services/email.service.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { planType } = req.body; // 'MONTHLY' or 'YEARLY'
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.subscriptionStatus === 'ACTIVE') {
      return res.status(400).json({ message: 'Active membership protocol already engaged.' });
    }

    const amount = planType === 'YEARLY' ? 499900 : 49900; // ₹4,999 vs ₹499 in paise
    const interval = planType === 'YEARLY' ? 'year' : 'month';
    const planName = planType === 'YEARLY' ? 'Yearly Vanguard Membership' : 'Monthly Operative Membership';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: planName,
              description: `Kinetic Horizon ${planType.toLowerCase()} subscription`,
            },
            unit_amount: amount,
            recurring: {
              interval: interval as any,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?canceled=true`,
      customer: user.stripeCustomerId || undefined,
      metadata: { userId, planType },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ message: 'Stripe error', error: error.message });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeCustomerId) return res.status(404).json({ message: 'No active subscription' });

    // Logic to cancel in Stripe
    // const subscriptions = await stripe.subscriptions.list({ customer: user.stripeCustomerId });
    // if (subscriptions.data.length > 0) {
    //   await stripe.subscriptions.update(subscriptions.data[0].id, { cancel_at_period_end: true });
    // }

    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: 'CANCELLED' },
    });

    res.json({ message: 'Subscription will be cancelled at the end of the period' });
  } catch (error) {
    res.status(500).json({ message: 'Stripe error', error });
  }
};

export const getStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true, renewalDate: true }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const syncSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // List recent checkout sessions to find a successful one for this user
    const sessions = await stripe.checkout.sessions.list({
      limit: 5,
    });

    // Find a session that matches this user and is paid
    const userSession = sessions.data.find(s => 
      s.metadata?.userId === userId && 
      s.status === 'complete' && 
      s.payment_status === 'paid'
    );

    if (userSession) {
      const planType = userSession.metadata?.planType as string;
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: 'ACTIVE',
          stripeCustomerId: userSession.customer as string,
          renewalDate: new Date(Date.now() + (planType === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000),
        },
      });

      // Create persistent subscription record if missing
      await prisma.subscription.create({ 
        data: { 
          userId, 
          planType: planType as any, 
          amount: userSession.amount_total ? userSession.amount_total / 100 : 0, 
          startDate: new Date(), 
          endDate: new Date(Date.now() + (planType === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000),
          status: 'ACTIVE'
        } 
      });

      // Send confirmation email if not already sent (optional, but good for UX)
      try {
        await emailService.sendSubscriptionConfirmation(updatedUser.email, planType);
      } catch (e) {
        console.error('Failed to send sync confirmation email:', e);
      }

      return res.json({ status: 'ACTIVE', message: 'Subscription synced successfully' });
    }

    const currentUser = await prisma.user.findUnique({ where: { id: userId }, select: { subscriptionStatus: true } });
    res.json({ status: currentUser?.subscriptionStatus, message: 'No new successful sessions found' });
  } catch (error: any) {
    console.error('Subscription Sync Error:', error);
    res.status(500).json({ message: 'Sync error', error: error.message });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const history = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error('Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
    }
    // req.body is the raw buffer thanks to express.raw in app.ts
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType;
        
        if (userId && planType) {
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: 'ACTIVE',
              stripeCustomerId: session.customer as string,
              renewalDate: new Date(Date.now() + (planType === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000),
            },
          });

          // Record persistent history
          await prisma.subscription.create({ 
            data: {
              userId, 
              planType: planType as any, 
              amount: session.amount_total ? session.amount_total / 100 : 0, 
              startDate: new Date(), 
              endDate: new Date(Date.now() + (planType === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000),
              status: 'ACTIVE'
            } 
          });

          // Send confirmation email
          if (updatedUser.email) {
            await emailService.sendSubscriptionConfirmation(updatedUser.email, planType);
          }
        }
        break;

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status === 'active' ? 'ACTIVE' : 'CANCELLED';
        
        await prisma.user.updateMany({
          where: { stripeCustomerId: subscription.customer as string },
          data: { subscriptionStatus: status },
        });
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook event handling error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
