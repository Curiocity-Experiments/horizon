// pages/api/feedback/create.js
import { authMiddleware } from '../../../lib/auth';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, description, category } = req.body;
    const userId = req.user.id; // Assuming authMiddleware adds user to req

    const docRef = await addDoc(collection(db, 'feedback'), {
      title,
      description,
      category,
      authorId: userId,
      createdAt: serverTimestamp(),
      voteCount: 0,
    });

    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error creating feedback', error: error.message });
  }
}

export default authMiddleware(handler);