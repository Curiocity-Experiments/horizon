// __tests__/pages/api/feedback/list.test.js
import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/feedback/list';

jest.mock('../../../../lib/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    feedback: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

describe('/api/feedback/list', () => {
  it('returns feedback items with pagination', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        page: '1',
        limit: '10',
      },
    });

    const mockFeedbackItems = [
      { id: '1', title: 'Feedback 1', description: 'Description 1' },
      { id: '2', title: 'Feedback 2', description: 'Description 2' },
    ];

    const prisma = require('@prisma/client').PrismaClient();
    prisma.feedback.findMany.mockResolvedValueOnce(mockFeedbackItems);
    prisma.feedback.count.mockResolvedValueOnce(20);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      feedbackItems: mockFeedbackItems,
      totalCount: 20,
      currentPage: 1,
      totalPages: 2,
    });
  });

  it('handles errors gracefully', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    const prisma = require('@prisma/client').PrismaClient();
    prisma.feedback.findMany.mockRejectedValueOnce(new Error('Database error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Error fetching feedback list',
      error: 'Database error',
    });
  });

  it('returns 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Method not allowed',
    });
  });
});
