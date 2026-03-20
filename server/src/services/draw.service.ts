import prisma from '../config/prisma';
import emailService from './email.service';

export const runDrawSimulation = async (logicType: string) => {
  // Generate 5 winning numbers (1-45)
  const winningNumbers: number[] = [];
  while (winningNumbers.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1;
    if (!winningNumbers.includes(n)) winningNumbers.push(n);
  }

  const winningNumbersStr = winningNumbers.sort((a,b) => a-b).join(',');

  // Calculate Prize Pool
  const activeSubscribers = await prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } });
  const subscriptionPrice = 20; // Assume 20 avg
  const poolPortion = 0.4; // 40% of sub goes to pool as per PRD logic? 
  // Wait PRD says: "A fixed portion of each subscription contributes to the prize pool."
  // It doesn't specify the % of sub total. Let's assume $5 per user for now.
  const totalPool = activeSubscribers * 5;

  const pool5 = totalPool * 0.40;
  const pool4 = totalPool * 0.35;
  const pool3 = totalPool * 0.25;

  // Find Winners
  const users = await prisma.user.findMany({
    where: { subscriptionStatus: 'ACTIVE' },
    include: { scores: { orderBy: { date: 'desc' }, take: 5 } }
  });

  const winnersList: any[] = [];

  for (const user of users) {
    const userNumbers = user.scores.map((s: any) => s.value);
    const matches = userNumbers.filter((n: number) => winningNumbers.includes(n)).length;

    if (matches >= 3) {
      winnersList.push({
        userId: user.id,
        matchType: `MATCH_${matches}`,
        matches
      });
    }
  }

  // Create Draw record in SIMULATION status
  const draw = await prisma.draw.create({
    data: {
      winningNumbers: winningNumbersStr,
      status: 'SIMULATION',
      logicType,
      prizePool5: pool5,
      prizePool4: pool4,
      prizePool3: pool3,
    }
  });

  return { draw, potentialWinners: winnersList };
};

export const publishSimulation = async (simulationId: string, potentialWinners: any[]) => {
  const draw = await prisma.draw.update({
    where: { id: simulationId },
    data: { status: 'PUBLISHED' }
  });

  // Actually create winner records and calculate individual prizes
  const counts = {
    MATCH_5: potentialWinners.filter(w => w.matchType === 'MATCH_5').length,
    MATCH_4: potentialWinners.filter(w => w.matchType === 'MATCH_4').length,
    MATCH_3: potentialWinners.filter(w => w.matchType === 'MATCH_3').length,
  };

  for (const win of potentialWinners) {
    const pool = win.matchType === 'MATCH_5' ? draw.prizePool5 : 
                 win.matchType === 'MATCH_4' ? draw.prizePool4 : 
                 draw.prizePool3;
    
    const count = counts[win.matchType as keyof typeof counts] || 1;
    const amount = pool / count; // Split the pool among winners

    const winner = await prisma.winner.create({
      data: {
        userId: win.userId,
        drawId: simulationId,
        prizeAmount: amount,
        matchType: win.matchType,
        payoutStatus: 'PENDING'
      },
      include: { user: true }
    }) as any;

    if (winner.user?.email) {
      await emailService.sendDrawResultNotification(winner.user.email, amount);
    }
  }

  return draw;
};
