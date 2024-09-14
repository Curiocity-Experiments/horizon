// pages/api/feedback/create.js
import { getSession } from 'next-auth/react';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { title, description, category } = req.body;
    const docRef = await addDoc(collection(db, 'feedback'), {
      title,
      description,
      category,
      userId: session.user.id,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ id: docRef.id, message: 'Feedback created successfully' });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Error creating feedback', error: error.message });
  }
}