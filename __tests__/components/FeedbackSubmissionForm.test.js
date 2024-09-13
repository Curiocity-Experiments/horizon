// __tests__/components/FeedbackSubmissionForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackSubmissionForm from '../../components/FeedbackSubmissionForm';

// Mock the fetch function
global.fetch = jest.fn();

const mockConfig = {
  colors: {
    primary: 'blue-500',
    secondary: 'blue-700',
  },
};

describe('FeedbackSubmissionForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the form correctly', () => {
    render(<FeedbackSubmissionForm config={mockConfig} />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Test Feedback' }),
    });

    render(<FeedbackSubmissionForm config={mockConfig} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Feedback' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'This is a test feedback description' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'feature' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit Feedback/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/feedback/create', expect.any(Object));
    });
  });

  it('displays validation errors for invalid data', async () => {
    render(<FeedbackSubmissionForm config={mockConfig} />);

    fireEvent.click(screen.getByRole('button', { name: /Submit Feedback/i }));

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    fetch.mockRejectedValueOnce(new Error('API error'));

    render(<FeedbackSubmissionForm config={mockConfig} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Feedback' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'This is a test feedback description' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'feature' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit Feedback/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit feedback/i)).toBeInTheDocument();
    });
  });
});
