import { beforeAll, afterAll } from 'vitest';

// Global test setup
beforeAll(async () => {
  // Setup code that runs before all tests
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
});

afterAll(async () => {
  // Cleanup code that runs after all tests
});
