// pages/api/auth/firebaseAuth.js
import { auth } from '../../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        res.status(200).json({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        image: user.photoURL,
        });
    } catch (error) {
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
}