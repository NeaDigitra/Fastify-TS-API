import { FastifyInstance } from 'fastify';
import {
  HealthResponseSchema,
  ReadinessResponseSchema,
} from '../schemas/health.schema';
import {
  ApiResponseSchema,
  ErrorResponseSchema,
} from '../schemas/response.schema';
import { API_CONSTANTS, MESSAGES } from '../config';
import { AwilixContainer } from 'awilix';
import { Container } from '../container/container';

export async function healthRoutes(
  fastify: FastifyInstance,
  options: { container?: AwilixContainer<Container> } = {}
) {
  const { container } = options as { container?: AwilixContainer<Container> };
  const healthController = container
    ? container.resolve('healthController')
    : new (await import('../controllers/health.controller')).HealthController();

  fastify.get(
    '/health',
    {
      schema: {
        tags: [API_CONSTANTS.OPENAPI.TAGS.HEALTH],
        summary: MESSAGES.API.HEALTH_SUMMARY,
        description: MESSAGES.API.HEALTH_DESCRIPTION,
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
        tags: [API_CONSTANTS.OPENAPI.TAGS.HEALTH],
        summary: MESSAGES.API.READINESS_SUMMARY,
        description: MESSAGES.API.READINESS_DESCRIPTION,
        response: {
          200: ApiResponseSchema(ReadinessResponseSchema),
          500: ErrorResponseSchema,
        },
      },
    },
    healthController.getReadiness
  );
}
