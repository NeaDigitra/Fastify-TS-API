import { FastifyRequest, FastifyReply } from 'fastify';

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
    'Request started'
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
      'Request completed'
    );

    return originalSend(payload);
  };
};
