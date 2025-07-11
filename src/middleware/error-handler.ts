import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/errors';
import { ResponseUtil } from '../utils/response';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const requestId = request.id;

  request.log.error(
    {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      requestId,
      url: request.url,
      method: request.method,
    },
    'Request error'
  );

  if (error instanceof AppError) {
    return reply
      .status(error.statusCode)
      .send(ResponseUtil.error(error.message, error.code));
  }

  if (error.validation) {
    return reply
      .status(400)
      .send(ResponseUtil.error('Validation failed', 'VALIDATION_ERROR'));
  }

  if (error.statusCode === 429) {
    return reply
      .status(429)
      .send(ResponseUtil.error('Rate limit exceeded', 'RATE_LIMITED'));
  }

  return reply
    .status(500)
    .send(ResponseUtil.error('Internal server error', 'INTERNAL_ERROR'));
};
