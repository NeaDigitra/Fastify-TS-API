export const API_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  RATE_LIMITING: {
    DEFAULT_MAX: 100,
    DEFAULT_WINDOW: 60000, // 1 minute in ms
    TEST_MAX: 1000,
  },
  VALIDATION: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    UUID_PATTERN:
      '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    POSITIVE_NUMBER_PATTERN: '^[1-9]\\d*$',
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
  },
  OPENAPI: {
    VERSION: '3.0.0',
    TAGS: {
      HEALTH: 'Health',
      USERS: 'Users',
    },
  },
} as const;
