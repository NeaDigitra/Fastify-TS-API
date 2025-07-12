import { FastifyInstance } from 'fastify';
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
import { API_CONSTANTS, MESSAGES } from '../config';
import { AwilixContainer } from 'awilix';
import { Container } from '../container/container';

export async function userRoutes(
  fastify: FastifyInstance,
  options: { container?: AwilixContainer<Container> } = {}
) {
  const { container } = options as { container?: AwilixContainer<Container> };
  const userController = container
    ? container.resolve('userController')
    : new (await import('../controllers/user.controller')).UserController();

  fastify.get(
    '/users',
    {
      schema: {
        tags: [API_CONSTANTS.OPENAPI.TAGS.USERS],
        summary: MESSAGES.API.GET_USERS_SUMMARY,
        description: MESSAGES.API.GET_USERS_DESCRIPTION,
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
        tags: [API_CONSTANTS.OPENAPI.TAGS.USERS],
        summary: MESSAGES.API.GET_USER_SUMMARY,
        description: MESSAGES.API.GET_USER_DESCRIPTION,
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
        tags: [API_CONSTANTS.OPENAPI.TAGS.USERS],
        summary: MESSAGES.API.CREATE_USER_SUMMARY,
        description: MESSAGES.API.CREATE_USER_DESCRIPTION,
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
        tags: [API_CONSTANTS.OPENAPI.TAGS.USERS],
        summary: MESSAGES.API.UPDATE_USER_SUMMARY,
        description: MESSAGES.API.UPDATE_USER_DESCRIPTION,
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
        tags: [API_CONSTANTS.OPENAPI.TAGS.USERS],
        summary: MESSAGES.API.DELETE_USER_SUMMARY,
        description: MESSAGES.API.DELETE_USER_DESCRIPTION,
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
