// pages/api/feedback/vote.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../lib/auth';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
  };
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { feedbackId, voteType } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const voteRef = doc(db, 'votes', `${userId}_${feedbackId}`);
    const voteDoc = await getDoc(voteRef);

    if (voteDoc.exists()) {
      const existingVote = voteDoc.data();
      if (existingVote.type === voteType) {
        // Remove vote
        await deleteDoc(voteRef);
        await updateDoc(doc(db, 'feedback', feedbackId), {
          voteCount: increment(voteType === 'upvote' ? -1 : 1)
        });
      } else {
        // Change vote type
        await setDoc(voteRef, { type: voteType }, { merge: true });
        await updateDoc(doc(db, 'feedback', feedbackId), {
          voteCount: increment(voteType === 'upvote' ? 2 : -2)
        });
      }
    } else {
      // Create new vote
      await setDoc(voteRef, { type: voteType, userId, feedbackId });
      await updateDoc(doc(db, 'feedback', feedbackId), {
        voteCount: increment(voteType === 'upvote' ? 1 : -1)
      });
    }

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error recording vote', error });
  }
}

export default authMiddleware(handler);