import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(65535))
    .default(3000),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  RATE_LIMIT_MAX: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default(100),
  RATE_LIMIT_WINDOW: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default(60000),
  API_PREFIX: z.string().default('/api/v1'),
  APP_NAME: z.string().default('Fastify TS API'),
  APP_VERSION: z.string().default('1.0.0'),
  PAGINATION_DEFAULT_PAGE: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default(1),
  PAGINATION_DEFAULT_LIMIT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default(10),
  PAGINATION_MAX_LIMIT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default(100),
  ENABLE_SAMPLE_DATA: z
    .string()
    .transform(val => val === 'true')
    .default(true),
  API_DESCRIPTION: z.string().default('A modular Fastify TypeScript REST API'),
});

type Environment = z.infer<typeof envSchema>;

let env: Environment;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.issues.forEach((err: z.ZodIssue) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export { env };
