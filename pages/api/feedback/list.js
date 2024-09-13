// pages/api/feedback/list.js
import { db } from '../../../lib/firebase';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import logger from '../../../lib/logger';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { page = '1', pageSize = '10', category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const pageNumber = parseInt(page, 10);
  const pageSizeNumber = parseInt(pageSize, 10);

  try {
    let q = collection(db, 'feedback');

    if (category) {
      q = query(q, where('category', '==', category));
    }

    q = query(q, orderBy(sortBy, sortOrder), limit(pageSizeNumber));

    // If it's not the first page, we need to use startAfter
    if (pageNumber > 1) {
      // This is a simplified approach. You might need to store the last document of each page
      // or implement a more sophisticated pagination method for production use.
      const previousPageDocs = await getDocs(query(q, limit((pageNumber - 1) * pageSizeNumber)));
      const lastVisibleDoc = previousPageDocs.docs[previousPageDocs.docs.length - 1];
      q = query(q, startAfter(lastVisibleDoc));
    }

    const querySnapshot = await getDocs(q);
    const feedbackItems = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString() // Convert Firestore Timestamp to ISO string
    }));

    // For simplicity, we're not calculating total count here as it can be expensive in Firestore
    // You might want to implement a separate counter or use Firebase Extensions for this

    logger.info(`Fetched feedback list: page ${pageNumber}, limit ${pageSizeNumber}`);
    res.status(200).json({
      feedbackItems,
      currentPage: pageNumber,
      // This is a placeholder. Implement proper pagination metadata as needed
      hasNextPage: feedbackItems.length === pageSizeNumber
    });
  } catch (error) {
    logger.error('Error fetching feedback list:', error);
    res.status(500).json({ message: 'Error fetching feedback list', error: error.message });
  }
}