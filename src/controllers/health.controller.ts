import { FastifyRequest, FastifyReply } from 'fastify';
import { ResponseUtil } from '../utils/response';
import { HealthResponse } from '../types';
import { env } from '../config';
import { MESSAGES } from '../config/messages';

export class HealthController {
  private messages: typeof MESSAGES;

  constructor(messages?: typeof MESSAGES) {
    this.messages = messages || MESSAGES;
  }
  getHealth = async (_request: FastifyRequest, reply: FastifyReply) => {
    const health: HealthResponse = {
      status: this.messages.HEALTH.STATUS_OK as 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: env.APP_VERSION,
      environment: env.NODE_ENV,
    };

    return reply.send(ResponseUtil.success(health));
  };

  getReadiness = async (_request: FastifyRequest, reply: FastifyReply) => {
    const readiness = {
      status: this.messages.HEALTH.STATUS_READY,
      timestamp: new Date().toISOString(),
      services: {
        api: this.messages.HEALTH.SERVICE_OPERATIONAL,
      },
    };

    return reply.send(ResponseUtil.success(readiness));
  };
}
