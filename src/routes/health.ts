import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    };
  });

  fastify.get('/health/ready', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return {
      status: 'ready',
      timestamp: new Date().toISOString()
    };
  });
}