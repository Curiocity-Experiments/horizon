// lib/auth.js
import { auth } from './firebase';
import { getIdToken } from 'firebase/auth';

export const authMiddleware = (handler) => async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'USER',
    };

    return handler(req, res);
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const isAdminMiddleware = (handler) => async (req, res) => {
  if (req.user && req.user.role === 'ADMIN') {
    return handler(req, res);
  }
  return res.status(403).json({ message: 'Forbidden' });
};