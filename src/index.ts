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
import { env, API_CONSTANTS, MESSAGES, interpolateMessage } from './config';
import { createDIContainer } from './container/container';

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
    // Initialize dependency injection container
    const container = createDIContainer();

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
        openapi: API_CONSTANTS.OPENAPI.VERSION,
        info: {
          title: env.APP_NAME,
          description: env.API_DESCRIPTION,
          version: env.APP_VERSION,
        },
        servers: [
          {
            url: `http://localhost:${env.PORT}`,
            description: 'Development server',
          },
        ],
        tags: [
          {
            name: API_CONSTANTS.OPENAPI.TAGS.HEALTH,
            description: MESSAGES.API.HEALTH_TAG_DESCRIPTION,
          },
          {
            name: API_CONSTANTS.OPENAPI.TAGS.USERS,
            description: MESSAGES.API.USERS_TAG_DESCRIPTION,
          },
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

    await server.register(healthRoutes, {
      prefix: env.API_PREFIX,
      container,
    });
    await server.register(userRoutes, {
      prefix: env.API_PREFIX,
      container,
    });

    const port = env.PORT;
    const host = env.HOST;

    await server.listen({ port, host });
    server.log.info(
      interpolateMessage(MESSAGES.INFO.SERVER_READY, {
        url: `http://${host}:${port}`,
      })
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

const signals = ['SIGINT', 'SIGTERM'];
signals.forEach(signal => {
  process.on(signal, async () => {
    server.log.info(
      interpolateMessage(MESSAGES.INFO.GRACEFUL_SHUTDOWN, { signal })
    );
    try {
      await server.close();
      server.log.info(MESSAGES.INFO.SERVER_CLOSED);
      process.exit(0);
    } catch (err) {
      server.log.error(MESSAGES.INFO.SHUTDOWN_ERROR, err);
      process.exit(1);
    }
  });
});

start();
