import { FastifyRequest, FastifyReply } from 'fastify';
import { ResponseUtil } from '../utils/response';
import { HealthResponse } from '../types';
import { env } from '../config';

export class HealthController {
  getHealth = async (_request: FastifyRequest, reply: FastifyReply) => {
    const health: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: env.APP_VERSION,
      environment: env.NODE_ENV,
    };

    return reply.send(ResponseUtil.success(health));
  };

  getReadiness = async (_request: FastifyRequest, reply: FastifyReply) => {
    const readiness = {
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
      },
    };

    return reply.send(ResponseUtil.success(readiness));
  };
}
