import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import emailService from '../services/email.service.js';
import crypto from 'crypto';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, charityId } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        charityId,
        role: 'USER',
        verificationToken,
      },
    });

    // Send verification email (non-blocking errors)
    try {
      await emailService.sendVerificationEmail(email, verificationToken, name);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // We still return 201 because the user is created
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: false, emailVerified: (user as any).emailVerified || false },
      message: 'Verification email sent'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Missing token' });

    const user = await prisma.user.findFirst({
      where: { verificationToken: token as string }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null } as any
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified, emailVerified: (user as any).emailVerified } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if ((user as any).emailVerified) return res.status(400).json({ message: 'Account already verified' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken }
    });

    await emailService.sendVerificationEmail(email, verificationToken, user.name || '');
    
    res.json({ message: 'Verification email resent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    // This would normally be protected by authenticate middleware
    // But for now let's just implement the logic
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true, role: true, subscriptionStatus: true, charityId: true, isVerified: true, emailVerified: true } as any
        });
        res.json(user);
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
