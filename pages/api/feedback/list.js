// pages/api/feedback/list.js
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import logger from '../../../lib/logger';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const pageNumber = parseInt(page);
    const size = parseInt(pageSize);

    let feedbackQuery = query(
      collection(db, 'feedback'),
      orderBy(sortBy, sortOrder),
      limit(size)
    );

    if (pageNumber > 1) {
      const lastVisible = await getLastVisible(pageNumber - 1, size, sortBy, sortOrder);
      feedbackQuery = query(feedbackQuery, startAfter(lastVisible));
    }

    const snapshot = await getDocs(feedbackQuery);
    const feedbackItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      feedbackItems,
      hasNextPage: feedbackItems.length === size
    });
  } catch (error) {
    console.error('Error fetching feedback items:', error);
    res.status(500).json({ message: 'Error fetching feedback items', error: error.message });
  }
}

async function getLastVisible(page, pageSize, sortBy, sortOrder) {
  const q = query(
    collection(db, 'feedback'),
    orderBy(sortBy, sortOrder),
    limit(page * pageSize)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs[snapshot.docs.length - 1];
}

