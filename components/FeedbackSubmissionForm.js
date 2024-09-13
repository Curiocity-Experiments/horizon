import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import logger from '../lib/logger';

/**
 * Schema for feedback form validation
 */
const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  category: yup.string().required('Category is required'),
});

/**
 * FeedbackSubmissionForm component for submitting new feedback.
 * Handles form validation, submission, and displays success/error messages.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.config - Private label configuration
 */
export default function FeedbackSubmissionForm({ config }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetches categories from the API
   */
  const fetchCategories = async () => {
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

  /**
   * Handles form submission
   * @param {Object} data - Form data
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/feedback/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      setSuccess(true);
      setTimeout(() => router.push('/feedback'), 2000);
    } catch (error) {
      logger.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component code ...
}