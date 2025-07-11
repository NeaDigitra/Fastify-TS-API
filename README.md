# Fastify TypeScript API

A modern REST API built with Fastify and TypeScript.

## Features

- 🚀 **Fast**: Built on Fastify for high performance
- 🔒 **Secure**: Includes helmet, CORS, and rate limiting
- 📝 **TypeScript**: Full type safety and modern JavaScript features
- 🧪 **Testing**: Configured with Vitest for fast testing
- 📋 **Linting**: ESLint with TypeScript support
- 🔄 **Hot Reload**: Development server with automatic restarts

## Quick Start

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## API Endpoints

### Health Check

- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/ready` - Readiness check

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user

## Environment Variables

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
src/
├── index.ts          # Application entry point
├── routes/           # Route handlers
│   ├── health.ts
│   └── users.ts
├── services/         # Business logic
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## License

MIT
