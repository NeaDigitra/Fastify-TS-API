import { Type, Static } from '@sinclair/typebox';
import { API_CONSTANTS } from '../config/constants';

export const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String({
    minLength: API_CONSTANTS.VALIDATION.NAME_MIN_LENGTH,
    maxLength: API_CONSTANTS.VALIDATION.NAME_MAX_LENGTH,
  }),
  email: Type.String({ format: 'email' }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const CreateUserSchema = Type.Object({
  name: Type.String({
    minLength: API_CONSTANTS.VALIDATION.NAME_MIN_LENGTH,
    maxLength: API_CONSTANTS.VALIDATION.NAME_MAX_LENGTH,
  }),
  email: Type.String({ format: 'email' }),
});

export const UpdateUserSchema = Type.Object({
  name: Type.Optional(
    Type.String({
      minLength: API_CONSTANTS.VALIDATION.NAME_MIN_LENGTH,
      maxLength: API_CONSTANTS.VALIDATION.NAME_MAX_LENGTH,
    })
  ),
  email: Type.Optional(Type.String({ format: 'email' })),
});

export const UserParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export const UserQuerySchema = Type.Object({
  page: Type.Optional(
    Type.String({
      pattern: API_CONSTANTS.VALIDATION.POSITIVE_NUMBER_PATTERN,
    })
  ),
  limit: Type.Optional(
    Type.String({
      pattern: API_CONSTANTS.VALIDATION.POSITIVE_NUMBER_PATTERN,
    })
  ),
});

export type User = Static<typeof UserSchema>;
export type CreateUser = Static<typeof CreateUserSchema>;
export type UpdateUser = Static<typeof UpdateUserSchema>;
export type UserParams = Static<typeof UserParamsSchema>;
export type UserQuery = Static<typeof UserQuerySchema>;
