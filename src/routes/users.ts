import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  UserParamsSchema,
  UserQuerySchema,
} from '../schemas/user.schema';
import {
  ApiResponseSchema,
  PaginatedResponseSchema,
  ErrorResponseSchema,
} from '../schemas/response.schema';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  fastify.get(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Get all users',
        description: 'Retrieve a list of all users with optional pagination',
        querystring: UserQuerySchema,
        response: {
          200: PaginatedResponseSchema(UserSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    userController.getAllUsers
  );

  fastify.get(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID',
        params: UserParamsSchema,
        response: {
          200: ApiResponseSchema(UserSchema),
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    userController.getUserById
  );

  fastify.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Create new user',
        description: 'Create a new user with name and email',
        body: CreateUserSchema,
        response: {
          201: ApiResponseSchema(UserSchema),
          400: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    userController.createUser
  );

  fastify.put(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Update user',
        description: 'Update an existing user by ID',
        params: UserParamsSchema,
        body: UpdateUserSchema,
        response: {
          200: ApiResponseSchema(UserSchema),
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    userController.updateUser
  );

  fastify.delete(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Delete user',
        description: 'Delete a user by ID',
        params: UserParamsSchema,
        response: {
          204: {},
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    userController.deleteUser
  );
}
