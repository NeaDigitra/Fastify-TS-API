import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { healthRoutes } from './routes/health';
import { userRoutes } from './routes/users';
import { errorHandler, requestLogger } from './middleware';
import { env } from './config';

const server = fastify({
  logger: {
    level: env.LOG_LEVEL,
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
  },
  genReqId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  },
}).withTypeProvider<TypeBoxTypeProvider>();

async function start() {
  try {
    server.setErrorHandler(errorHandler);

    await server.register(helmet);

    await server.register(cors, {
      origin: true,
    });

    await server.register(rateLimit, {
      max: env.RATE_LIMIT_MAX,
      timeWindow: env.RATE_LIMIT_WINDOW,
    });

    await server.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: env.APP_NAME,
          description: 'A modular Fastify TypeScript REST API',
          version: env.APP_VERSION,
        },
        servers: [
          {
            url: `http://localhost:${env.PORT}`,
            description: 'Development server',
          },
        ],
        tags: [
          { name: 'Health', description: 'Health check endpoints' },
          { name: 'Users', description: 'User management endpoints' },
        ],
      },
    });

    await server.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
    });

    server.addHook('preHandler', requestLogger);

    await server.register(healthRoutes, { prefix: env.API_PREFIX });
    await server.register(userRoutes, { prefix: env.API_PREFIX });

    const port = env.PORT;
    const host = env.HOST;

    await server.listen({ port, host });
    server.log.info(`🚀 Server ready at http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

const signals = ['SIGINT', 'SIGTERM'];
signals.forEach(signal => {
  process.on(signal, async () => {
    server.log.info(`Received ${signal}, shutting down gracefully`);
    try {
      await server.close();
      server.log.info('Server closed');
      process.exit(0);
    } catch (err) {
      server.log.error('Error during shutdown', err);
      process.exit(1);
    }
  });
});

start();
