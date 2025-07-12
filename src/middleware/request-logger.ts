import { FastifyRequest, FastifyReply } from 'fastify';
import { MESSAGES } from '../config/messages';

export const requestLogger = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const start = Date.now();

  request.log.info(
    {
      requestId: request.id,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    },
    MESSAGES.INFO.REQUEST_STARTED
  );

  const originalSend = reply.send.bind(reply);
  reply.send = function (payload) {
    const responseTime = Date.now() - start;

    request.log.info(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: `${responseTime}ms`,
      },
      MESSAGES.INFO.REQUEST_COMPLETED
    );

    return originalSend(payload);
  };
};
