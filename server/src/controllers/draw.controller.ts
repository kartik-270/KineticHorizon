import { Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import * as drawService from '../services/draw.service.js';

export const getLatestDraw = async (req: AuthRequest, res: Response) => {
  try {
    const draw = await prisma.draw.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { drawDate: 'desc' },
      include: { winners: { include: { user: { select: { name: true } } } } }
    });
    res.json(draw);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDrawHistory = async (req: AuthRequest, res: Response) => {
    try {
      const draws = await prisma.draw.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { drawDate: 'desc' },
        take: 10
      });
      res.json(draws);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
};

export const simulateDraw = async (req: AuthRequest, res: Response) => {
  try {
    const { logicType } = req.body; // 'RANDOM' or 'ALGORITHM'
    const simulation = await drawService.runDrawSimulation(logicType);
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ message: 'Simulation error', error });
  }
};

export const publishDraw = async (req: AuthRequest, res: Response) => {
  try {
    const { simulationId, potentialWinners } = req.body;
    const draw = await drawService.publishSimulation(simulationId as string, potentialWinners);
    res.json(draw);
  } catch (error) {
    res.status(500).json({ message: 'Publish error', error });
  }
};
