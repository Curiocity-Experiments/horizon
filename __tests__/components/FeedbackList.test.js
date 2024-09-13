// __tests__/components/FeedbackList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackList from '../../components/FeedbackList';

// Mock the fetch function
global.fetch = jest.fn();

const mockConfig = {
  colors: {
    primary: 'blue-500',
    secondary: 'blue-700',
  },
};

describe('FeedbackList', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders loading state initially', () => {
    render(<FeedbackList config={mockConfig} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders feedback items when data is loaded', async () => {
    const mockFeedbackItems = [
      { id: '1', title: 'Feedback 1', description: 'Description 1', voteCount: 5 },
      { id: '2', title: 'Feedback 2', description: 'Description 2', voteCount: 3 },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ feedbackItems: mockFeedbackItems, totalPages: 1 }),
    });

    render(<FeedbackList config={mockConfig} />);

    await waitFor(() => {
      expect(screen.getByText('Feedback 1')).toBeInTheDocument();
      expect(screen.getByText('Feedback 2')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    const mockFeedbackItems = [
      { id: '1', title: 'Feedback 1', description: 'Description 1', voteCount: 5 },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ feedbackItems: mockFeedbackItems, totalPages: 2, currentPage: 1 }),
    });

    render(<FeedbackList config={mockConfig} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    // Mock the next page fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ feedbackItems: mockFeedbackItems, totalPages: 2, currentPage: 2 }),
    });

    fireEvent.click(screen.getByLabelText('Next page'));

    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });
  });

  it('displays an error message when fetching fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API error'));

    render(<FeedbackList config={mockConfig} />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load feedback items/)).toBeInTheDocument();
    });
  });
});
