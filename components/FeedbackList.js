// components/FeedbackList.js

// TODO: Implement error boundary to handle potential errors in the component
// TODO: Add loading skeleton for better user experience while fetching data


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import VoteButton from './VoteButton';

export default function FeedbackList({ config, initialFeedbackItems = [] }) {
  const [feedbackItems, setFeedbackItems] = useState(initialFeedbackItems);
  const [isLoading, setIsLoading] = useState(!initialFeedbackItems.length);

  useEffect(() => {
    if (!initialFeedbackItems.length) {
      fetchFeedbackItems();
    }
  }, [initialFeedbackItems]);

  const fetchFeedbackItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/feedback/list');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback items');
      }
      const data = await response.json();
      setFeedbackItems(data.feedbackItems);
    } catch (error) {
      console.error('Error fetching feedback items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!feedbackItems.length) {
    return (
      <div className="text-center">
        <p>No feedback items yet.</p>
        <Link href="/submit-feedback">
          <a className="btn btn-primary mt-4">Submit Feedback</a>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {feedbackItems.map((item) => (
        <div key={item.id} className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p>{item.description}</p>
          <VoteButton feedbackId={item.id} initialVoteCount={item.voteCount} />
        </div>
      ))}
      <Link href="/submit-feedback">
        <a className="btn btn-primary mt-4">Submit Feedback</a>
      </Link>
    </div>
  );
}