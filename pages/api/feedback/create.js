// pages/api/feedback/create.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../../../lib/auth'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, description, category } = req.body
    const userId = req.user.id // Assuming authMiddleware adds user to req

    const feedback = await prisma.feedback.create({
      data: {
        title,
        description,
        category,
        authorId: userId,
      },
    })

    res.status(201).json(feedback)
  } catch (error) {
    res.status(500).json({ message: 'Error creating feedback', error })
  }
}

export default authMiddleware(handler)