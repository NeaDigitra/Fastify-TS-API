import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { healthRoutes } from '../../src/routes/health';
import { userRoutes } from '../../src/routes/users';
import { errorHandler, requestLogger } from '../../src/middleware';
import { createDIContainer } from '../../src/container/container';
import { API_CONSTANTS } from '../../src/config/constants';

export async function createTestServer() {
  const server = fastify({
    logger: false, // Disable logging in tests
    genReqId: () => {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  server.setErrorHandler(errorHandler);

  await server.register(helmet);

  await server.register(cors, {
    origin: true,
  });

  await server.register(rateLimit, {
    max: API_CONSTANTS.RATE_LIMITING.TEST_MAX,
    timeWindow: '1 minute',
  });

  await server.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        description: 'Test API for unit tests',
        version: '1.0.0',
      },
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
  });

  server.addHook('preHandler', requestLogger);

  // Create DI container for tests
  const container = createDIContainer();

  await server.register(healthRoutes, {
    prefix: '/api/v1',
    container,
  });
  await server.register(userRoutes, {
    prefix: '/api/v1',
    container,
  });

  return server;
}
