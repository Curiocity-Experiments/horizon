// pages/index.js

// TODO: Implement server-side pagination for better performance with large datasets
// TODO: Add meta tags for SEO optimization

import React from 'react';
import FeedbackList from '../components/FeedbackList';
import Layout from '../components/Layout';
import { getConfig } from '../config/privateLabel';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

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
  // TODO: Implement caching mechanism for server-side props to improve performance
  const config = getConfig(context.req.headers.host);
  
  let initialFeedbackItems = [];
  try {
    // TODO: Implement error handling and fallback for database queries
    const feedbackQuery = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(10));
    const feedbackSnapshot = await getDocs(feedbackQuery);
    initialFeedbackItems = feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching initial feedback items:', error);
    // TODO: Implement proper error logging and monitoring
  }

  return {
    props: { config, initialFeedbackItems },
  };
}