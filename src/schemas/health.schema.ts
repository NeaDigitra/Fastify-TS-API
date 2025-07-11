import { Type, Static } from '@sinclair/typebox';

export const HealthResponseSchema = Type.Object({
  status: Type.Union([Type.Literal('ok'), Type.Literal('error')]),
  timestamp: Type.String({ format: 'date-time' }),
  uptime: Type.Number({ minimum: 0 }),
  version: Type.String(),
  environment: Type.String(),
});

export const ReadinessResponseSchema = Type.Object({
  status: Type.Literal('ready'),
  timestamp: Type.String({ format: 'date-time' }),
  services: Type.Object({
    api: Type.String(),
  }),
});

export type HealthResponse = Static<typeof HealthResponseSchema>;
export type ReadinessResponse = Static<typeof ReadinessResponseSchema>;
