// pages/api/admin/categories.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, isAdminMiddleware } from '../../../lib/auth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error });
    }
  } else if (req.method === 'POST') {
    try {
      const { name } = req.body;
      const category = await prisma.category.create({
        data: { name },
      });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name } = req.body;
      const category = await prisma.category.update({
        where: { id },
        data: { name },
      });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error updating category', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await prisma.category.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default authMiddleware(isAdminMiddleware(handler));