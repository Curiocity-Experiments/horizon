// components/FeedbackSubmissionForm.js

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function FeedbackSubmissionForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      signIn();
      return;
    }

    try {
      const response = await fetch('/api/feedback/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Feedback created:', data);
        router.push('/feedback'); // Redirect to feedback list
      } else {
        setError('Failed to create feedback');
      }
    } catch (error) {
      setError('Error submitting feedback: ' + error.message);
    }
  };

  if (!session) {
    return (
      <div>
        <p>You need to be signed in to submit feedback.</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="title" className="block mb-1">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="category" className="block mb-1">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Bug Report</option>
          <option value="improvement">Improvement</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit Feedback
      </button>
    </form>
  );
}