// pages/index.js

import React from 'react';
import FeedbackList from '../components/FeedbackList';
import Layout from '../components/Layout';
import { getConfig } from '../config/privateLabel';
import { adminDb } from '../lib/firebase';

export default function Home({ config, initialFeedbackItems }) {
  return (
    <Layout config={config}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center">Feature Requests</h1>
        <FeedbackList config={config} initialFeedbackItems={initialFeedbackItems} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const config = getConfig(context.req.headers.host);
  
  let initialFeedbackItems = [];
  try {
    const feedbackRef = adminDb.collection('feedback');
    const feedbackSnapshot = await feedbackRef.orderBy('createdAt', 'desc').limit(10).get();
    initialFeedbackItems = feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching initial feedback items:', error);
  }

  return {
    props: { config, initialFeedbackItems },
  };
}