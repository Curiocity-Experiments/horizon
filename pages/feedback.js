// pages/api/admin/feedback.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, isAdminMiddleware } from '../../../lib/auth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const { id, status, category } = req.body;

      const updatedFeedback = await prisma.feedback.update({
        where: { id },
        data: { status, category },
      });

      res.status(200).json(updatedFeedback);
    } catch (error) {
      res.status(500).json({ message: 'Error updating feedback', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      await prisma.feedback.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting feedback', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default authMiddleware(isAdminMiddleware(handler));