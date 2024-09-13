import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, isAdminMiddleware } from '../../../lib/auth';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error });
    }
  } else if (req.method === 'POST') {
    try {
      const { name } = req.body;
      const docRef = await addDoc(collection(db, 'categories'), { name });
      res.status(201).json({ id: docRef.id, name });
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name } = req.body;
      await updateDoc(doc(db, 'categories', id), { name });
      res.status(200).json({ id, name });
    } catch (error) {
      res.status(500).json({ message: 'Error updating category', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await deleteDoc(doc(db, 'categories', id));
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default authMiddleware(isAdminMiddleware(handler));