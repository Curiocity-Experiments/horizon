// pages/api/feedback/vote.js
import { db } from '../../../lib/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { authMiddleware } from '../../../lib/auth';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { feedbackId, voteType } = req.body;
        const userId = req.user.id;

        await runTransaction(db, async (transaction) => {
        const feedbackRef = doc(db, 'feedback', feedbackId);
        const voteRef = doc(db, 'votes', `${userId}_${feedbackId}`);

        const feedbackDoc = await transaction.get(feedbackRef);
        const voteDoc = await transaction.get(voteRef);

        if (!feedbackDoc.exists()) {
            throw new Error('Feedback not found');
        }

        const currentVoteCount = feedbackDoc.data().voteCount || 0;

        if (voteDoc.exists()) {
            const existingVote = voteDoc.data().type;
            if (existingVote === voteType) {
            // Remove vote
            transaction.delete(voteRef);
            transaction.update(feedbackRef, { 
                voteCount: currentVoteCount + (voteType === 'upvote' ? -1 : 1) 
            });
            } else {
            // Change vote
            transaction.update(voteRef, { type: voteType });
            transaction.update(feedbackRef, { 
                voteCount: currentVoteCount + (voteType === 'upvote' ? 2 : -2) 
            });
            }
        } else {
            // New vote
            transaction.set(voteRef, { type: voteType, userId, feedbackId });
            transaction.update(feedbackRef, { 
            voteCount: currentVoteCount + (voteType === 'upvote' ? 1 : -1) 
            });
        }
        });

        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording vote', error: error.message });
    }
}

export default authMiddleware(handler);