import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/errors';
import { ResponseUtil } from '../utils/response';
import { MESSAGES } from '../config/messages';
import { API_CONSTANTS } from '../config/constants';

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
      .status(API_CONSTANTS.HTTP_STATUS.BAD_REQUEST)
      .send(
        ResponseUtil.error(MESSAGES.ERROR.VALIDATION_FAILED, 'VALIDATION_ERROR')
      );
  }

  if (error.statusCode === API_CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS) {
    return reply
      .status(API_CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS)
      .send(ResponseUtil.error(MESSAGES.ERROR.RATE_LIMITED, 'RATE_LIMITED'));
  }

  return reply
    .status(API_CONSTANTS.HTTP_STATUS.INTERNAL_ERROR)
    .send(ResponseUtil.error(MESSAGES.ERROR.INTERNAL_ERROR, 'INTERNAL_ERROR'));
};
