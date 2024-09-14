// pages/api/feedback/vote.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { feedbackId, voteType } = req.body;

    const feedbackRef = doc(db, 'feedback', feedbackId);
    const feedbackDoc = await getDoc(feedbackRef);

    if (!feedbackDoc.exists()) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await updateDoc(feedbackRef, {
      voteCount: increment(voteType === 'upvote' ? 1 : -1)
    });

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ message: 'Error recording vote', error: error.message });
  }
}