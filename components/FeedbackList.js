// components/FeedbackList.js

// TODO: Implement error boundary to handle potential errors in the component
// TODO: Add loading skeleton for better user experience while fetching data


import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import VoteButton from './VoteButton';
import logger from '../lib/logger';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';

export default function FeedbackList({ config, initialFeedbackItems = [] }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedbackItems, setFeedbackItems] = useState(initialFeedbackItems);

  const { data: session, status } = useSession();

  const debouncedFetchFeedbackItems = useCallback(
    debounce(async () => {
      if (!hasMore) return;

      setIsLoading(true);
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        sortBy,
        sortOrder,
        page: page.toString(),
        pageSize: '10',
      }).toString();

      try {
        const response = await fetch(`/api/feedback/list?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFeedbackItems(prevItems => [...prevItems, ...data.feedbackItems]);
        setHasMore(data.hasNextPage);
        setPage(prevPage => prevPage + 1);
      } catch (error) {
        console.error('Error fetching feedback items:', error);
        setError('Failed to load feedback items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [hasMore, page, selectedCategory, sortBy, sortOrder, session]
  );

  useEffect(() => {
    if (status === 'authenticated') {
      setPage(1);
      setFeedbackItems([]);
      setHasMore(true);
      debouncedFetchFeedbackItems();
    }
  }, [selectedCategory, sortBy, sortOrder, debouncedFetchFeedbackItems, status]);

  useEffect(() => {
    if (!initialFeedbackItems) {
      debouncedFetchFeedbackItems();
    }
  }, [debouncedFetchFeedbackItems, initialFeedbackItems]);

  const handleLoadMore = () => {
    if (!isLoading) {
      debouncedFetchFeedbackItems();
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      }
    };

    fetchCategories();
  }, []);

  // Add these functions inside the component, before the return statement
const handleSort = (newSortBy) => {
  if (newSortBy === sortBy) {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  } else {
    setSortBy(newSortBy);
    setSortOrder('desc');
  }
  setPage(1);
  setFeedbackItems([]);
  setHasMore(true);
};

const handleFilter = (category) => {
  setSelectedCategory(category);
  setPage(1);
  setFeedbackItems([]);
  setHasMore(true);
};

  return (
    <div className="space-y-6">
      {/* TODO: Extract filter and sort controls into separate components for better maintainability */}
      <div className="flex justify-end space-x-2">
        <button className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-2" /> New Feedback
        </button>
        <button className="btn btn-secondary flex items-center">
          <Filter size={16} className="mr-2" /> Filter
        </button>
        <button className="btn btn-secondary flex items-center">
          <ArrowUpDown size={16} className="mr-2" /> Sort
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Link href="/submit-feedback">
            <a className="btn btn-primary flex items-center">
              <Plus size={16} className="mr-2" /> New Feedback
            </a>
          </Link>
          <select
            className="btn btn-secondary"
            value={selectedCategory}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            className={`btn ${sortBy === 'createdAt' ? 'btn-primary' : 'btn-secondary'} flex items-center`}
            onClick={() => handleSort('createdAt')}
          >
            <ArrowUpDown size={16} className="mr-2" />
            Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`btn ${sortBy === 'voteCount' ? 'btn-primary' : 'btn-secondary'} flex items-center`}
            onClick={() => handleSort('voteCount')}
          >
            <ArrowUpDown size={16} className="mr-2" />
            Votes {sortBy === 'voteCount' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedbackItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.category}</span>
              <VoteButton feedbackId={item.id} initialVotes={item.voteCount} />
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}