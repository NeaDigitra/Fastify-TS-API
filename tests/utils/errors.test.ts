import { describe, it, expect } from 'vitest';
import {
  AppError,
  ErrorCode,
  NotFoundError,
  DuplicateResourceError,
  ValidationError,
  ForbiddenError,
  RateLimitError,
  InternalError,
} from '../../src/utils/errors';

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should create an app error with custom message and status code', () => {
      const error = new AppError(
        'Custom error',
        418,
        'INTERNAL_ERROR' as ErrorCode.INTERNAL_ERROR
      );

      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(418);
      expect(error.name).toBe('AppError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should handle error code and details', () => {
      const error = new AppError(
        'Test error',
        500,
        'INTERNAL_ERROR' as ErrorCode.INTERNAL_ERROR,
        { test: true }
      );

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.details).toEqual({ test: true });
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error with custom message', () => {
      const error = new NotFoundError('Resource not found');

      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('NotFoundError');
    });

    it('should use default message when none provided', () => {
      const error = new NotFoundError();

      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('DuplicateResourceError', () => {
    it('should create a duplicate resource error with custom message', () => {
      const error = new DuplicateResourceError('Resource already exists');

      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(409);
      expect(error.name).toBe('DuplicateResourceError');
    });

    it('should use default message when none provided', () => {
      const error = new DuplicateResourceError();

      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(409);
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error with custom message', () => {
      const error = new ValidationError('Invalid input data');

      expect(error.message).toBe('Invalid input data');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ValidationError');
    });

    it('should handle validation errors with details', () => {
      const error = new ValidationError('Validation failed', {
        field: 'email',
      });

      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ field: 'email' });
    });
  });

  describe('ForbiddenError', () => {
    it('should create a forbidden error with custom message', () => {
      const error = new ForbiddenError('Access denied');

      expect(error.message).toBe('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.name).toBe('ForbiddenError');
    });

    it('should use default message when none provided', () => {
      const error = new ForbiddenError();

      expect(error.message).toBe('Forbidden');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('RateLimitError', () => {
    it('should create a rate limit error with custom message', () => {
      const error = new RateLimitError('Too many requests');

      expect(error.message).toBe('Too many requests');
      expect(error.statusCode).toBe(429);
      expect(error.name).toBe('RateLimitError');
    });

    it('should use default message when none provided', () => {
      const error = new RateLimitError();

      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
    });
  });

  describe('InternalError', () => {
    it('should create an internal error with custom message', () => {
      const error = new InternalError('Something went wrong');

      expect(error.message).toBe('Something went wrong');
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe('InternalError');
    });

    it('should use default message when none provided', () => {
      const error = new InternalError();

      expect(error.message).toBe('Internal server error');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('Error inheritance', () => {
    it('should maintain proper prototype chain', () => {
      const notFoundError = new NotFoundError();
      const duplicateError = new DuplicateResourceError();
      const validationError = new ValidationError();

      expect(notFoundError).toBeInstanceOf(AppError);
      expect(notFoundError).toBeInstanceOf(Error);
      expect(duplicateError).toBeInstanceOf(AppError);
      expect(duplicateError).toBeInstanceOf(Error);
      expect(validationError).toBeInstanceOf(AppError);
      expect(validationError).toBeInstanceOf(Error);
    });

    it('should have correct stack traces', () => {
      const error = new NotFoundError('Test error');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('NotFoundError: Test error');
    });
  });
});
