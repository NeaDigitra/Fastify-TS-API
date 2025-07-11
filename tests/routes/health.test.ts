import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestServer } from '../utils/test-server';

describe('Health Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createTestServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('status', 'ok');
      expect(body.data).toHaveProperty('timestamp');
      expect(body.data).toHaveProperty('uptime');
      expect(body.data).toHaveProperty('version');
      expect(body.data).toHaveProperty('environment');
    });
  });

  describe('GET /api/v1/health/ready', () => {
    it('should return readiness status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health/ready',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('status', 'ready');
      expect(body.data).toHaveProperty('timestamp');
      expect(body.data).toHaveProperty('services');
      expect(body.data.services).toHaveProperty('api', 'operational');
    });
  });
});
