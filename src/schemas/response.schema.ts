import { Type, Static, TSchema } from '@sinclair/typebox';

export const ApiResponseSchema = <T extends TSchema>(dataSchema: T) =>
  Type.Object({
    success: Type.Boolean(),
    data: Type.Optional(dataSchema),
    message: Type.Optional(Type.String()),
    error: Type.Optional(Type.String()),
    timestamp: Type.String({ format: 'date-time' }),
  });

export const PaginationSchema = Type.Object({
  page: Type.Number({ minimum: 1 }),
  limit: Type.Number({ minimum: 1, maximum: 100 }),
  total: Type.Number({ minimum: 0 }),
  totalPages: Type.Number({ minimum: 0 }),
});

export const PaginatedResponseSchema = <T extends TSchema>(dataSchema: T) =>
  Type.Object({
    success: Type.Boolean(),
    data: Type.Optional(Type.Array(dataSchema)),
    pagination: PaginationSchema,
    message: Type.Optional(Type.String()),
    error: Type.Optional(Type.String()),
    timestamp: Type.String({ format: 'date-time' }),
  });

export const ErrorResponseSchema = Type.Object({
  success: Type.Literal(false),
  message: Type.String(),
  error: Type.Optional(Type.String()),
  timestamp: Type.String({ format: 'date-time' }),
});

export type ErrorResponse = Static<typeof ErrorResponseSchema>;
