export const MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
  },
  ERROR: {
    USER_NOT_FOUND: 'User with id {{id}} not found',
    USER_EMAIL_EXISTS: 'User with this email already exists',
    VALIDATION_FAILED: 'Validation failed',
    RATE_LIMITED: 'Rate limit exceeded',
    INTERNAL_ERROR: 'Internal server error',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
  },
  VALIDATION: {
    REQUIRED_FIELD: '{{field}} is required',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_UUID: 'Invalid UUID format',
    MIN_LENGTH: '{{field}} must be at least {{min}} characters',
    MAX_LENGTH: '{{field}} must not exceed {{max}} characters',
    POSITIVE_NUMBER: '{{field}} must be a positive number',
  },
  INFO: {
    REQUEST_STARTED: 'Request started',
    REQUEST_COMPLETED: 'Request completed',
    SERVER_READY: 'Server ready at {{url}}',
    GRACEFUL_SHUTDOWN: 'Received {{signal}}, shutting down gracefully',
    SERVER_CLOSED: 'Server closed',
    SHUTDOWN_ERROR: 'Error during shutdown',
  },
  HEALTH: {
    STATUS_OK: 'ok',
    STATUS_ERROR: 'error',
    STATUS_READY: 'ready',
    SERVICE_OPERATIONAL: 'operational',
  },
  API: {
    DESCRIPTION: 'A modular Fastify TypeScript REST API',
    HEALTH_TAG_DESCRIPTION: 'Health check endpoints',
    USERS_TAG_DESCRIPTION: 'User management endpoints',
    HEALTH_SUMMARY: 'Health check',
    HEALTH_DESCRIPTION: 'Check API health status',
    READINESS_SUMMARY: 'Readiness check',
    READINESS_DESCRIPTION: 'Check API readiness status',
    GET_USERS_SUMMARY: 'Get all users',
    GET_USERS_DESCRIPTION:
      'Retrieve a list of all users with optional pagination',
    GET_USER_SUMMARY: 'Get user by ID',
    GET_USER_DESCRIPTION: 'Retrieve a specific user by their ID',
    CREATE_USER_SUMMARY: 'Create new user',
    CREATE_USER_DESCRIPTION: 'Create a new user with name and email',
    UPDATE_USER_SUMMARY: 'Update user',
    UPDATE_USER_DESCRIPTION: 'Update an existing user by ID',
    DELETE_USER_SUMMARY: 'Delete user',
    DELETE_USER_DESCRIPTION: 'Delete a user by ID',
  },
} as const;

// Helper function to interpolate messages
export function interpolateMessage(
  template: string,
  variables: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key]?.toString() || match;
  });
}
