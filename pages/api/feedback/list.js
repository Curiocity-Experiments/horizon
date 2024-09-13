// pages/api/feedback/list.js
import { PrismaClient } from '@prisma/client';
import logger from '../../../lib/logger';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { page = '1', limit = '10', category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const where = category ? { categories: { some: { id: category } } } : {};
    const orderBy = { [sortBy]: sortOrder };

    const [feedbackItems, totalCount] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy,
        skip,
        take: limitNumber,
        include: {
          author: {
            select: { name: true },
          },
          categories: {
            select: { name: true },
          },
        },
      }),
      prisma.feedback.count({ where }),
    ]);

    logger.info(`Fetched feedback list: page ${pageNumber}, limit ${limitNumber}`);
    res.status(200).json({
      feedbackItems,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    });
  } catch (error) {
    logger.error('Error fetching feedback list:', error);
    res.status(500).json({ message: 'Error fetching feedback list', error: error.message });
  }
}
