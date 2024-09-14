import { adminDb } from '../../lib/firebase';

export default async function handler(req, res) {
  try {
    if (!adminDb) {
      throw new Error('adminDb is undefined');
    }

    console.log('Attempting to access Firestore...');
    const testCollection = adminDb.collection('test');
    const testDocRef = testCollection.doc('testDoc');
    
    console.log('Attempting to get document...');
    let testDoc = await testDocRef.get();

    console.log('Document exists:', testDoc.exists);

    if (!testDoc.exists) {
      console.log('Document does not exist, creating it...');
      await testDocRef.set({ created: new Date().toISOString() });
      console.log('Document created, fetching again...');
      testDoc = await testDocRef.get();
    }

    console.log('Final document data:', testDoc.data());

    res.status(200).json({ 
      message: 'Firebase connection successful', 
      exists: testDoc.exists,
      data: testDoc.data()
    });
  } catch (error) {
    console.error('Detailed Firebase Error:', error);
    res.status(500).json({ 
      message: 'Firebase connection failed', 
      error: error.toString(),
      stack: error.stack,
      code: error.code,
      details: error.details
    });
  }
}