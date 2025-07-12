import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { errorHandler } from '../../src/middleware/error-handler';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockFastify: Partial<FastifyInstance>;

  beforeEach(() => {
    mockRequest = {
      id: 'test-request-id',
      log: {
        error: vi.fn(),
      } as FastifyRequest['log'],
    };

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    mockFastify = {
      log: {
        error: vi.fn(),
      } as FastifyInstance['log'],
    };
  });

  it('should handle rate limit errors (429)', async () => {
    const rateLimitError = new Error('Rate limit exceeded');
    (rateLimitError as Error & { statusCode: number }).statusCode = 429;

    await errorHandler(
      rateLimitError,
      mockRequest as FastifyRequest,
      mockReply as FastifyReply,
      mockFastify as FastifyInstance
    );

    expect(mockReply.status).toHaveBeenCalledWith(429);
    expect(mockReply.send).toHaveBeenCalledWith({
      success: false,
      error: 'RATE_LIMITED',
      message: 'Rate limit exceeded',
      timestamp: expect.any(String),
    });
  });

  it('should handle generic errors without statusCode', async () => {
    const genericError = new Error('Something went wrong');

    await errorHandler(
      genericError,
      mockRequest as FastifyRequest,
      mockReply as FastifyReply,
      mockFastify as FastifyInstance
    );

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Internal server error',
      timestamp: expect.any(String),
    });
  });

  it('should handle errors with no message', async () => {
    const errorWithoutMessage = new Error();

    await errorHandler(
      errorWithoutMessage,
      mockRequest as FastifyRequest,
      mockReply as FastifyReply,
      mockFastify as FastifyInstance
    );

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Internal server error',
      timestamp: expect.any(String),
    });
  });
});
