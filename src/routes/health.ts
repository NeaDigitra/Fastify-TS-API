import { FastifyInstance } from 'fastify';
import { HealthController } from '../controllers/health.controller';
import {
  HealthResponseSchema,
  ReadinessResponseSchema,
} from '../schemas/health.schema';
import {
  ApiResponseSchema,
  ErrorResponseSchema,
} from '../schemas/response.schema';

export async function healthRoutes(fastify: FastifyInstance) {
  const healthController = new HealthController();

  fastify.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Check API health status',
        response: {
          200: ApiResponseSchema(HealthResponseSchema),
          500: ErrorResponseSchema,
        },
      },
    },
    healthController.getHealth
  );

  fastify.get(
    '/health/ready',
    {
      schema: {
        tags: ['Health'],
        summary: 'Readiness check',
        description: 'Check API readiness status',
        response: {
          200: ApiResponseSchema(ReadinessResponseSchema),
          500: ErrorResponseSchema,
        },
      },
    },
    healthController.getReadiness
  );
}
