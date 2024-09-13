import { auth } from '../../../lib/firebase';

export const authMiddleware = (handler) => async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        return handler(req, res);
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
    };

    export const isAdminMiddleware = (handler) => async (req, res) => {
    if (!req.user || !req.user.admin) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    return handler(req, res);
};