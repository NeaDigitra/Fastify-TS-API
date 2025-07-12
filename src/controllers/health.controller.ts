import { FastifyRequest, FastifyReply } from 'fastify';
import { ResponseUtil } from '../utils/response';
import { HealthResponse } from '../types';
import { env } from '../config';
import { MESSAGES } from '../config/messages';

export class HealthController {
  private readonly messagesObj: typeof MESSAGES;

  constructor({
    messages,
  }: {
    messages?: typeof MESSAGES;
  } = {}) {
    this.messagesObj = messages || MESSAGES;
  }
  getHealth = async (_request: FastifyRequest, reply: FastifyReply) => {
    const health: HealthResponse = {
      status: this.messagesObj.HEALTH.STATUS_OK as 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: env.APP_VERSION,
      environment: env.NODE_ENV,
    };

    return reply.send(ResponseUtil.success(health));
  };

  getReadiness = async (_request: FastifyRequest, reply: FastifyReply) => {
    const readiness = {
      status: this.messagesObj.HEALTH.STATUS_READY,
      timestamp: new Date().toISOString(),
      services: {
        api: this.messagesObj.HEALTH.SERVICE_OPERATIONAL,
      },
    };

    return reply.send(ResponseUtil.success(readiness));
  };
}
