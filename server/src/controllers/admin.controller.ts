import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, subscriptionStatus: true, createdAt: true, isVerified: true, emailVerified: true } as any
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const user = await prisma.user.update({ 
            where: { id: id as string }, 
            data 
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeSubsCount = await prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } });
    const totalCharities = await prisma.charity.count();
    
    const subscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' }
    });

    const totalRevenue = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCharityContributions = totalRevenue * 0.1; // 10% Protocol
    const totalPrizePool = totalRevenue * 0.75; // 75% Community Pool

    res.json({
      totalUsers,
      activeSubscribers: activeSubsCount,
      totalCharities,
      totalPrizePool,
      totalCharityContributions,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

import bcrypt from 'bcryptjs';

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Operative already registered in network.' });

    const hashedPassword = await bcrypt.hash(password || 'Golfgiver@123', 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER',
        isVerified: true, // Admin created users are pre-vetted
        emailVerified: true
      } as any
    });

    res.status(201).json(user);
  } catch (error) {
     res.status(500).json({ message: 'Server error', error });
  }
};

export const createCharity = async (req: AuthRequest, res: Response) => {
  try {
    const charity = await prisma.charity.create({ data: req.body });
    res.status(201).json(charity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateCharity = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const charity = await prisma.charity.update({ 
            where: { id: id as string }, 
            data: req.body 
        });
        res.json(charity);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteCharity = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.charity.delete({ where: { id: id as string } });
        res.json({ message: 'Charity deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getWinners = async (req: AuthRequest, res: Response) => {
  try {
    const winners = await prisma.winner.findMany({
      include: { user: { select: { name: true, email: true } }, draw: true }
    });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const verifyWinner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // 'PAID', 'REJECTED'

    const winner = await prisma.winner.update({
      where: { id: id as string },
      data: { payoutStatus: status, adminNotes: notes }
    });

    res.json(winner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
