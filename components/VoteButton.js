// components/VoteButton.js

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function VoteButton({ feedbackId, initialVoteCount }) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const savedVote = localStorage.getItem(`vote_${feedbackId}`);
    if (savedVote) {
      setUserVote(savedVote);
    }
  }, [feedbackId]);

  const handleVote = async (voteType) => {
    try {
      const response = await fetch('/api/feedback/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId, voteType }),
      });

      if (response.ok) {
        if (userVote === voteType) {
          // Remove vote
          setVoteCount(prev => prev + (voteType === 'upvote' ? -1 : 1));
          setUserVote(null);
          localStorage.removeItem(`vote_${feedbackId}`);
        } else {
          // New vote or change vote
          setVoteCount(prev => prev + (voteType === 'upvote' ? 1 : -1) + (userVote ? (userVote === 'upvote' ? -1 : 1) : 0));
          setUserVote(voteType);
          localStorage.setItem(`vote_${feedbackId}`, voteType);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleVote('upvote')}
        className={`p-1 rounded ${userVote === 'upvote' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
      >
        <ArrowUp size={16} />
      </button>
      <span>{voteCount}</span>
      <button
        onClick={() => handleVote('downvote')}
        className={`p-1 rounded ${userVote === 'downvote' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
      >
        <ArrowDown size={16} />
      </button>
    </div>
  );
}