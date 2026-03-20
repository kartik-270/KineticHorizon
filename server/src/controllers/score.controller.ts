import { Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import emailService from '../services/email.service.js';

export const addScore = async (req: AuthRequest, res: Response) => {
  try {
    const { value, date } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Validate score (1-45)
    if (value < 1 || value > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    // Add new score
    await prisma.score.create({
      data: {
        userId,
        value,
        date: new Date(date),
      },
    });

    // Prune: Keep only most recent 5
    const latestScores = await prisma.score.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { id: true },
    });

    if (latestScores.length > 5) {
      const idsToDelete = latestScores.slice(5).map(s => s.id);
      await prisma.score.deleteMany({
        where: { id: { in: idsToDelete } }
      });
    }

    // Get user and charity for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { charity: true }
    });

    if (user?.email) {
      await emailService.sendScoreEntryConfirmation(user.email, value, user.charity?.name || 'Selected Charity');
    }

    // Return the updated 5 scores (most recent first)
    const updatedScores = await prisma.score.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5
    });

    res.status(201).json(updatedScores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getScores = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5
    });

    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
