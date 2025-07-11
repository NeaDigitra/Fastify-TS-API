import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestServer } from '../utils/test-server';

describe('User Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createTestServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/v1/users', () => {
    it('should return all users', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/users',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
    });

    it('should return paginated users', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/users?page=1&limit=1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('pagination');
      expect(body.pagination).toHaveProperty('page', 1);
      expect(body.pagination).toHaveProperty('limit', 1);
      expect(body.pagination).toHaveProperty('total');
      expect(body.pagination).toHaveProperty('totalPages');
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: newUser,
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('name', newUser.name);
      expect(body.data).toHaveProperty('email', newUser.email);
      expect(body.data).toHaveProperty('createdAt');
      expect(body.data).toHaveProperty('updatedAt');
    });

    it('should return 409 for duplicate email', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: 'test@example.com',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: duplicateUser,
      });

      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', false);
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('already exists');
    });

    it('should return 400 for invalid data', async () => {
      const invalidUser = {
        name: '',
        email: 'invalid-email',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: invalidUser,
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    let userId: string;

    beforeAll(async () => {
      // Create a user for testing
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          name: 'Get Test User',
          email: 'gettest@example.com',
        },
      });
      const body = JSON.parse(response.body);
      userId = body.data.id;
    });

    it('should return user by id', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/api/v1/users/${userId}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id', userId);
      expect(body.data).toHaveProperty('name', 'Get Test User');
      expect(body.data).toHaveProperty('email', 'gettest@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      const response = await server.inject({
        method: 'GET',
        url: `/api/v1/users/${fakeId}`,
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', false);
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('not found');
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    let userId: string;

    beforeAll(async () => {
      // Create a user for testing
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          name: 'Update Test User',
          email: 'updatetest@example.com',
        },
      });
      const body = JSON.parse(response.body);
      userId = body.data.id;
    });

    it('should update user', async () => {
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      const response = await server.inject({
        method: 'PUT',
        url: `/api/v1/users/${userId}`,
        payload: updateData,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id', userId);
      expect(body.data).toHaveProperty('name', updateData.name);
      expect(body.data).toHaveProperty('email', updateData.email);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      const response = await server.inject({
        method: 'PUT',
        url: `/api/v1/users/${fakeId}`,
        payload: { name: 'Updated Name' },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    let userId: string;

    beforeAll(async () => {
      // Create a user for testing
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          name: 'Delete Test User',
          email: 'deletetest@example.com',
        },
      });
      const body = JSON.parse(response.body);
      userId = body.data.id;
    });

    it('should delete user', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/v1/users/${userId}`,
      });

      expect(response.statusCode).toBe(204);
      expect(response.body).toBe('');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/v1/users/${fakeId}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
