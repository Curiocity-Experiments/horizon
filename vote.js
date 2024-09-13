// pages/api/feedback/vote.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../../lib/auth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { feedbackId, voteType } = req.body;
    const userId = req.user.id; // Assuming authMiddleware adds user to req

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_feedbackId: {
          userId,
          feedbackId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        // Remove vote if user clicks the same button again
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
        await prisma.feedback.update({
          where: { id: feedbackId },
          data: { voteCount: { decrement: voteType === 'upvote' ? 1 : -1 } },
        });
      } else {
        // Change vote type
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: voteType },
        });
        await prisma.feedback.update({
          where: { id: feedbackId },
          data: { voteCount: { increment: voteType === 'upvote' ? 2 : -2 } },
        });
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          type: voteType,
          userId,
          feedbackId,
        },
      });
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { voteCount: { increment: voteType === 'upvote' ? 1 : -1 } },
      });
    }

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error recording vote', error });
  }
}

export default authMiddleware(handler);