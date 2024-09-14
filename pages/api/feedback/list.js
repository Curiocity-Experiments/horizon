// pages/api/feedback/list.js

import { adminDb } from '../../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const feedbackRef = adminDb.collection('feedback');
    const feedbackSnapshot = await feedbackRef.orderBy('createdAt', 'desc').limit(10).get();
    const feedbackItems = feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ feedbackItems });
  } catch (error) {
    console.error('Error fetching feedback items:', error);
    res.status(500).json({ message: 'Error fetching feedback items', error: error.message });
  }
}