// lib/validationMiddleware.js

import * as yup from 'yup';
import logger from './logger';

// Feedback schema
const feedbackSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must not exceed 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, 'Description must not exceed 1000 characters'),
  category: yup
    .string()
    .required('Category is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
});

// Vote schema
const voteSchema = yup.object().shape({
  feedbackId: yup
    .string()
    .required('Feedback ID is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid feedback ID'),
  voteType: yup
    .string()
    .required('Vote type is required')
    .oneOf(['upvote', 'downvote'], 'Invalid vote type'),
});

// Category schema
const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters long')
    .max(50, 'Category name must not exceed 50 characters'),
});

// Generic validation middleware
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.warn('Validation failed:', error);
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors,
    });
  }
};

// Specific middleware functions
export const validateFeedback = validate(feedbackSchema);
export const validateVote = validate(voteSchema);
export const validateCategory = validate(categorySchema);

// Custom middleware for query parameters
export const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  
  const schema = yup.object().shape({
    page: yup.number().positive().integer().default(1),
    limit: yup.number().positive().integer().max(100).default(10),
  });

  try {
    const validatedQuery = schema.validateSync({ page, limit }, { abortEarly: false });
    req.query.page = validatedQuery.page;
    req.query.limit = validatedQuery.limit;
    next();
  } catch (error) {
    logger.warn('Pagination validation failed:', error);
    res.status(400).json({
      error: 'Invalid pagination parameters',
      details: error.errors,
    });
  }
};

export default {
  validateFeedback,
  validateVote,
  validateCategory,
  validatePagination,
};
