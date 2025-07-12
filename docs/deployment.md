# Deployment Guide

This guide covers different deployment strategies for the Fastify TypeScript API, from development to production environments.

## 🐳 Docker Deployment (Recommended)

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built application
COPY --chown=nodejs:nodejs dist ./dist

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/index.js"]
```

### Multi-stage Build (Optimized)

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/index.js"]
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
      - LOG_LEVEL=info
    restart: unless-stopped
    healthcheck:
      test:
        [
          'CMD',
          'node',
          '-e',
          "require('http').get('http://localhost:3000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Optional: Add a reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
    restart: unless-stopped
```

### Build and Run

```bash
# Build the image
docker build -t fastify-ts-api .

# Run the container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  fastify-ts-api

# Using Docker Compose
docker-compose up -d
```

---

## ☁️ Cloud Deployment

### AWS ECS (Elastic Container Service)

#### Task Definition (`task-definition.json`)

```json
{
  "family": "fastify-ts-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "fastify-ts-api",
      "image": "your-account.dkr.ecr.region.amazonaws.com/fastify-ts-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/fastify-ts-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "node -e \"require('http').get('http://localhost:3000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })\""
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### Deployment Script

```bash
#!/bin/bash

# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

docker build -t fastify-ts-api .
docker tag fastify-ts-api:latest your-account.dkr.ecr.us-east-1.amazonaws.com/fastify-ts-api:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/fastify-ts-api:latest

# Update ECS service
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs update-service --cluster your-cluster --service fastify-ts-api --task-definition fastify-ts-api
```

### Google Cloud Run

#### Deploy to Cloud Run

```bash
# Build and submit to Cloud Build
gcloud builds submit --tag gcr.io/PROJECT-ID/fastify-ts-api

# Deploy to Cloud Run
gcloud run deploy fastify-ts-api \
  --image gcr.io/PROJECT-ID/fastify-ts-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production,PORT=3000
```

#### Cloud Run YAML Configuration

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: fastify-ts-api
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: '10'
        run.googleapis.com/cpu-throttling: 'false'
    spec:
      containerConcurrency: 100
      containers:
        - image: gcr.io/PROJECT-ID/fastify-ts-api
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
            - name: PORT
              value: '3000'
          resources:
            limits:
              cpu: '1'
              memory: '512Mi'
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 30
```

### Heroku

#### Procfile

```
web: npm start
```

#### Deploy to Heroku

```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set LOG_LEVEL=info

# Deploy
git push heroku main

# Scale up
heroku ps:scale web=1
```

---

## 🚀 Traditional Server Deployment

### PM2 (Process Manager)

#### PM2 Configuration (`ecosystem.config.js`)

```javascript
module.exports = {
  apps: [
    {
      name: 'fastify-ts-api',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        LOG_LEVEL: 'info',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        LOG_LEVEL: 'warn',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '5s',
    },
  ],
};
```

#### Deployment Commands

```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

# Monitor
pm2 monit
```

### Nginx Reverse Proxy

#### Nginx Configuration (`/etc/nginx/sites-available/fastify-ts-api`)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check endpoint (no rate limiting)
    location /api/v1/health {
        proxy_pass http://localhost:3000;
        access_log off;
    }

    # Static files (if any)
    location /static/ {
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔧 Environment-Specific Configurations

### Development Environment

```bash
# .env.development
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=debug
ENABLE_SAMPLE_DATA=true
```

### Staging Environment

```bash
# .env.staging
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info
ENABLE_SAMPLE_DATA=false
# Database connection for staging
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=warn
ENABLE_SAMPLE_DATA=false
# Production database connection
# Redis connection for caching
# External service configurations
```

---

## 📊 Monitoring and Observability

### Health Checks

The API includes built-in health checks:

- **Liveness**: `/api/v1/health`
- **Readiness**: `/api/v1/health/ready`

### Logging

Production logging configuration:

```typescript
const logger = {
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : undefined,
};
```

### Metrics (Optional Integration)

#### Prometheus Metrics

```typescript
import promClient from 'prom-client';

const httpDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

// Middleware to collect metrics
fastify.addHook('onResponse', (request, reply, done) => {
  httpDuration
    .labels(request.method, request.routerPath, reply.statusCode.toString())
    .observe(reply.getResponseTime() / 1000);
  done();
});
```

---

## 🚨 Production Checklist

### Security

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable security headers (Helmet)
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Remove debug logs in production
- [ ] Use non-root user in containers

### Performance

- [ ] Enable compression
- [ ] Set up connection pooling
- [ ] Configure proper resource limits
- [ ] Enable clustering (PM2 or K8s)
- [ ] Set up CDN for static assets
- [ ] Configure caching strategies

### Monitoring

- [ ] Set up health checks
- [ ] Configure log aggregation
- [ ] Set up error tracking
- [ ] Monitor resource usage
- [ ] Set up alerts

### Reliability

- [ ] Configure auto-restart
- [ ] Set up load balancing
- [ ] Plan backup strategies
- [ ] Test disaster recovery
- [ ] Configure graceful shutdown

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Your deployment script here
          echo "Deploying to production..."
```

---

This deployment guide provides multiple options for deploying your Fastify TypeScript API, from simple Docker containers to full cloud deployments with monitoring and CI/CD pipelines.
