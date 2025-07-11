import { Type, Static } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  email: Type.String({ format: 'email' }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const CreateUserSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  email: Type.String({ format: 'email' }),
});

export const UpdateUserSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  email: Type.Optional(Type.String({ format: 'email' })),
});

export const UserParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export const UserQuerySchema = Type.Object({
  page: Type.Optional(Type.String({ pattern: '^[1-9]\\d*$' })),
  limit: Type.Optional(Type.String({ pattern: '^[1-9]\\d*$' })),
});

export type User = Static<typeof UserSchema>;
export type CreateUser = Static<typeof CreateUserSchema>;
export type UpdateUser = Static<typeof UpdateUserSchema>;
export type UserParams = Static<typeof UserParamsSchema>;
export type UserQuery = Static<typeof UserQuerySchema>;
