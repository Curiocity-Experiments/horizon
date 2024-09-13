import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function VoteButton({ feedbackId, initialVoteCount, initialUserVote }) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState(initialUserVote);

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
        } else if (userVote) {
          // Change vote
          setVoteCount(prev => prev + (voteType === 'upvote' ? 2 : -2));
          setUserVote(voteType);
        } else {
          // New vote
          setVoteCount(prev => prev + (voteType === 'upvote' ? 1 : -1));
          setUserVote(voteType);
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