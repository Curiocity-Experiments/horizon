import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import VoteButton from './VoteButton';
import { Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import logger from '../lib/logger';

export default function FeedbackList({ config }) {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchFeedbackItems();
    fetchCategories();
  }, [selectedCategory, sortBy, sortOrder, currentPage]);

  const fetchFeedbackItems = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams({
      category: selectedCategory,
      sortBy,
      sortOrder,
      page: currentPage,
      pageSize: 10,
    }).toString();

    try {
      const response = await fetch(`/api/feedback/list?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedback items');
      }
      const data = await response.json();
      setFeedbackItems(data.feedbackItems);
      setHasNextPage(data.hasNextPage);
    } catch (error) {
      logger.error('Error fetching feedback items:', error);
      setError('Failed to load feedback items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    // TODO: Implement fetching categories from Firestore
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      logger.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again later.');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Filters and sorting controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* ... (existing filter and sort controls) ... */}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Feedback items */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedbackItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                {/* ... (existing feedback item content) ... */}
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'}`}
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'}`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}