// __tests__/pages/api/feedback/create.test.js
import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/feedback/create';

jest.mock('../../../../lib/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    feedback: {
      create: jest.fn(),
    },
  })),
}));

jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
}));

describe('/api/feedback/create', () => {
  it('creates feedback successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'Test Feedback',
        description: 'This is a test feedback',
        category: 'feature',
      },
    });

    const mockSession = {
      user: { id: '1', name: 'Test User' },
    };

    require('next-auth/react').getSession.mockResolvedValueOnce(mockSession);

    const prisma = require('@prisma/client').PrismaClient();
    prisma.feedback.create.mockResolvedValueOnce({
      id: '1',
      title: 'Test Feedback',
      description: 'This is a test feedback',
      category: 'feature',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual(expect.objectContaining({
      id: '1',
      title: 'Test Feedback',
    }));
  });

  it('returns 401 for unauthenticated requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'Test Feedback',
        description: 'This is a test feedback',
        category: 'feature',
      },
    });

    require('next-auth/react').getSession.mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Unauthorized',
    });
  });

  it('returns 400 for invalid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'Test',
        description: 'Short',
      },
    });

    const mockSession = {
      user: { id: '1', name: 'Test User' },
    };

    require('next-auth/react').getSession.mockResolvedValueOnce(mockSession);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toHaveProperty('errors');
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Method not allowed',
    });
  });
});
