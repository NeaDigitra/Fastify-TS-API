import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { healthRoutes } from './routes/health';
import { userRoutes } from './routes/users';

const server = fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }
});

async function start() {
  try {
    await server.register(helmet);
    
    await server.register(cors, {
      origin: true
    });

    await server.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute'
    });

    await server.register(healthRoutes, { prefix: '/api/v1' });
    await server.register(userRoutes, { prefix: '/api/v1' });

    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    console.log(`🚀 Server ready at http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();