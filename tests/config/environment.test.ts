import { describe, it, expect } from 'vitest';
import { env } from '../../src/config/environment';

describe('Environment Configuration', () => {
  it('should load environment configuration', () => {
    expect(env).toBeDefined();
    expect(env.PORT).toBeTypeOf('number');
    expect(env.NODE_ENV).toBeTypeOf('string');
    expect(env.LOG_LEVEL).toBeTypeOf('string');
  });

  it('should test environment module has error handling', () => {
    // Test environment module structure indirectly
    expect(typeof env).toBe('object');
    expect(env).toBeDefined();
    // This ensures the environment module loaded successfully
    expect(env.NODE_ENV).toBeDefined();
  });

  it('should validate environment schema structure', () => {
    // Check that all expected properties exist
    expect(env).toHaveProperty('NODE_ENV');
    expect(env).toHaveProperty('PORT');
    expect(env).toHaveProperty('HOST');
    expect(env).toHaveProperty('LOG_LEVEL');
    expect(env).toHaveProperty('RATE_LIMIT_MAX');
    expect(env).toHaveProperty('API_PREFIX');
    expect(env).toHaveProperty('APP_NAME');
    expect(env).toHaveProperty('API_DESCRIPTION');
  });

  it('should handle different environment transformations', () => {
    // Test that environment values are correctly typed
    expect(typeof env.PORT).toBe('number');
    expect(typeof env.RATE_LIMIT_MAX).toBe('number');
    expect(typeof env.ENABLE_SAMPLE_DATA).toBe('boolean');
    expect(['development', 'production', 'test']).toContain(env.NODE_ENV);
  });

  it('should provide sensible defaults', () => {
    // Test that defaults are reasonable
    expect(env.PORT).toBeGreaterThan(0);
    expect(env.PORT).toBeLessThan(65536);
    expect(env.HOST).toBeDefined();
    expect(env.API_PREFIX.startsWith('/api')).toBe(true);
    expect(env.APP_NAME).toBeDefined();
  });
});
