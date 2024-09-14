// pages/api/feedback/create.js

import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, description, category } = req.body;
    const docRef = await addDoc(collection(db, 'feedback'), {
      title,
      description,
      category,
      createdAt: new Date().toISOString(),
      voteCount: 0
    });

    res.status(201).json({ id: docRef.id, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
}