import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export const getCharities = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const charities = await prisma.charity.findMany({
      where: search ? {
        OR: [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ]
      } : {},
    });
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getFeaturedCharity = async (req: Request, res: Response) => {
  try {
    const charity = await prisma.charity.findFirst({
      where: { isFeatured: true },
    });
    res.json(charity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getCharityById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const charity = await prisma.charity.findUnique({ where: { id: id as string } });
        if (!charity) return res.status(404).json({ message: 'Charity not found' });
        res.json(charity);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const selectCharity = async (req: AuthRequest, res: Response) => {
  try {
    const { charityId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    await prisma.user.update({
      where: { id: userId },
      data: { charityId },
    });

    res.json({ message: 'Charity selected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateCharityPercentage = async (req: AuthRequest, res: Response) => {
    try {
        const { percentage } = req.body;
        const userId = req.user?.id;

        if (percentage < 10) {
            return res.status(400).json({ message: 'Minimum contribution is 10%' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { charityPercentage: percentage },
        });

        res.json({ message: 'Charity percentage updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const donateToCharity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; // Amount in INR/USD units (not cents yet)
    const userId = req.user?.id;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Invalid donation amount' });
    }

    const charity = await prisma.charity.findUnique({ where: { id: id as string } });
    if (!charity) return res.status(404).json({ message: 'Charity not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Donation to ${charity.name}`,
              description: charity.description,
              images: charity.imageUrl ? [charity.imageUrl] : [],
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/charities?success=true&charity=${encodeURIComponent(charity.name)}`,
      cancel_url: `${process.env.FRONTEND_URL}/charities?canceled=true`,
      metadata: {
        userId: (userId as string) || 'anonymous',
        charityId: id as string,
        type: 'DIRECT_DONATION'
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Donation Error:', error);
    res.status(500).json({ message: 'Failed to initialize donation', error });
  }
};
