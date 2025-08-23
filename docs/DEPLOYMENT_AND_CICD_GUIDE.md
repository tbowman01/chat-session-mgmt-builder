# Deployment and CI/CD Pipeline Guide

## Overview

This guide provides comprehensive specifications for deploying the Chat Session Management Builder application, including CI/CD pipeline configuration, environment setup, monitoring, and production deployment strategies.

## 1. CI/CD Pipeline Architecture

### 1.1 GitHub Actions Workflow Configuration

**.github/workflows/main.yml**
```yaml
name: Build, Test, and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20.x'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Code Quality and Linting
  lint:
    name: Lint and Format Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check Prettier formatting
        run: npx prettier --check .

      - name: TypeScript type check
        run: npm run typecheck

  # Security Scanning
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # Unit and Integration Tests
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: [lint]
    strategy:
      matrix:
        workspace: [frontend, server]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests for ${{ matrix.workspace }}
        run: cd ${{ matrix.workspace }} && npm test -- --coverage --watchAll=false

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ${{ matrix.workspace }}/coverage/lcov.info
          flags: ${{ matrix.workspace }}
          name: ${{ matrix.workspace }}-coverage

  # End-to-End Tests
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [test]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start application
        run: |
          npm run dev &
          sleep 30

      - name: Run Playwright tests
        run: cd frontend && npx playwright test

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/

  # Build and Package
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [test, security]
    outputs:
      frontend-artifact: ${{ steps.build-frontend.outputs.artifact-id }}
      server-artifact: ${{ steps.build-server.outputs.artifact-id }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        id: build-frontend
        run: |
          cd frontend
          npm run build
          echo "artifact-id=frontend-build-${{ github.sha }}" >> $GITHUB_OUTPUT

      - name: Build server
        id: build-server
        run: |
          cd server
          npm run build
          echo "artifact-id=server-build-${{ github.sha }}" >> $GITHUB_OUTPUT

      - name: Upload frontend build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ steps.build-frontend.outputs.artifact-id }}
          path: frontend/dist/

      - name: Upload server build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ steps.build-server.outputs.artifact-id }}
          path: server/dist/

  # Docker Build and Push
  docker:
    name: Build and Push Docker Images
    runs-on: ubuntu-latest
    needs: [build]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    strategy:
      matrix:
        component: [frontend, server]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-${{ matrix.component }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./${{ matrix.component }}
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Deploy to Staging
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [e2e, docker]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.chat-session-builder.com
    steps:
      - name: Deploy to staging environment
        run: |
          echo "Deploying to staging..."
          # Staging deployment commands would go here

  # Deploy to Production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [e2e, docker]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://chat-session-builder.com
    steps:
      - name: Deploy to production environment
        run: |
          echo "Deploying to production..."
          # Production deployment commands would go here

      - name: Notify deployment success
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: "🚀 Successfully deployed Chat Session Builder to production!"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  # Performance Testing
  performance:
    name: Performance Tests
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.js'
          uploadArtifacts: true
          temporaryPublicStorage: true
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Run load tests
        run: |
          npx artillery run ./tests/load-test.yml
```

### 1.2 Environment-Specific Configurations

**Environment Configuration Files**

**.env.development**
```env
NODE_ENV=development
FRONTEND_PORT=5173
SERVER_PORT=3000
API_BASE_URL=http://localhost:3000

# External Services (Development)
NOTION_TOKEN=your_dev_notion_token
AIRTABLE_TOKEN=your_dev_airtable_token

# Security
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
LOG_FORMAT=dev

# Analytics
ANALYTICS_ENABLED=false
SENTRY_DSN=
```

**.env.staging**
```env
NODE_ENV=staging
FRONTEND_PORT=5173
SERVER_PORT=3000
API_BASE_URL=https://api-staging.chat-session-builder.com

# External Services (Staging)
NOTION_TOKEN=${NOTION_STAGING_TOKEN}
AIRTABLE_TOKEN=${AIRTABLE_STAGING_TOKEN}

# Security
CORS_ORIGINS=https://staging.chat-session-builder.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=${JWT_STAGING_SECRET}

# Database
DATABASE_URL=${STAGING_DATABASE_URL}

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Analytics
ANALYTICS_ENABLED=true
SENTRY_DSN=${SENTRY_STAGING_DSN}
```

**.env.production**
```env
NODE_ENV=production
FRONTEND_PORT=5173
SERVER_PORT=3000
API_BASE_URL=https://api.chat-session-builder.com

# External Services (Production)
NOTION_TOKEN=${NOTION_PRODUCTION_TOKEN}
AIRTABLE_TOKEN=${AIRTABLE_PRODUCTION_TOKEN}

# Security
CORS_ORIGINS=https://chat-session-builder.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=60
JWT_SECRET=${JWT_PRODUCTION_SECRET}

# Database
DATABASE_URL=${PRODUCTION_DATABASE_URL}

# Logging
LOG_LEVEL=warn
LOG_FORMAT=json

# Analytics
ANALYTICS_ENABLED=true
SENTRY_DSN=${SENTRY_PRODUCTION_DSN}
```

## 2. Docker Configuration

### 2.1 Frontend Dockerfile

**frontend/Dockerfile**
```dockerfile
# Multi-stage build for frontend
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../shared/package*.json ../shared/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .
COPY ../shared ../shared

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.25-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Add security headers
RUN echo 'add_header X-Frame-Options "SAMEORIGIN" always;' > /etc/nginx/conf.d/security.conf && \
    echo 'add_header X-Content-Type-Options "nosniff" always;' >> /etc/nginx/conf.d/security.conf && \
    echo 'add_header X-XSS-Protection "1; mode=block" always;' >> /etc/nginx/conf.d/security.conf && \
    echo 'add_header Referrer-Policy "strict-origin-when-cross-origin" always;' >> /etc/nginx/conf.d/security.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    include /etc/nginx/conf.d/security.conf;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        # Enable browser caching for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy (if needed)
        location /api/ {
            proxy_pass ${API_BASE_URL};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### 2.2 Backend Dockerfile

**server/Dockerfile**
```dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Add a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./
COPY ../shared/package*.json ../shared/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nodejs:nodejs . .
COPY --chown=nodejs:nodejs ../shared ../shared

# Build the application
RUN npm run build

# Remove source files, keep only built files
RUN rm -rf src tsconfig.json

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').request('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) }).end()"

EXPOSE 3000

CMD ["node", "dist/app.js"]
```

## 3. Infrastructure as Code

### 3.1 Docker Compose for Development

**docker-compose.yml**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      target: builder
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - ./shared:/shared
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_API_BASE_URL=http://localhost:3000
    depends_on:
      - server
    command: npm run dev

  server:
    build:
      context: ./server
    ports:
      - "3000:3000"
    volumes:
      - ./server:/app
      - ./shared:/shared
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - PORT=3000
      - CORS_ORIGINS=http://localhost:5173
    env_file:
      - .env.development
    depends_on:
      - postgres
      - redis
    command: npm run dev

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: chat_builder_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - server

volumes:
  postgres_data:
  redis_data:
```

### 3.2 Kubernetes Deployment (Production)

**k8s/namespace.yaml**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: chat-session-builder
  labels:
    name: chat-session-builder
```

**k8s/frontend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: chat-session-builder
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: ghcr.io/your-org/chat-session-builder-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: chat-session-builder
spec:
  selector:
    app: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

**k8s/backend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: chat-session-builder
  labels:
    app: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/your-org/chat-session-builder-server:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: NOTION_TOKEN
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: notion-token
        - name: AIRTABLE_TOKEN
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: airtable-token
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: chat-session-builder
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: ClusterIP
```

**k8s/ingress.yaml**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: chat-builder-ingress
  namespace: chat-session-builder
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "60"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - chat-session-builder.com
    - api.chat-session-builder.com
    secretName: chat-builder-tls
  rules:
  - host: chat-session-builder.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
  - host: api.chat-session-builder.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 3000
```

## 4. Monitoring and Observability

### 4.1 Application Performance Monitoring

**Monitoring Configuration (monitoring/prometheus.yml)**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: 'chat-builder-frontend'
    static_configs:
      - targets: ['frontend-service:80']
    metrics_path: '/metrics'
    
  - job_name: 'chat-builder-backend'
    static_configs:
      - targets: ['backend-service:3000']
    metrics_path: '/metrics'
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
    
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

**Alert Rules (monitoring/alerts.yml)**
```yaml
groups:
  - name: chat-builder-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 10% for 5 minutes"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is above 2 seconds"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ $labels.job }} service is down"
```

### 4.2 Application Metrics Collection

**Backend Metrics (server/src/middleware/metrics.ts)**
```typescript
import { Request, Response, NextFunction } from 'express';
import promClient from 'prom-client';

// Create metrics registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

const activeConnections = new promClient.Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register]
});

const provisioningJobsTotal = new promClient.Counter({
  name: 'provisioning_jobs_total',
  help: 'Total number of provisioning jobs',
  labelNames: ['platform', 'status'],
  registers: [register]
});

const provisioningDuration = new promClient.Histogram({
  name: 'provisioning_duration_seconds',
  help: 'Duration of provisioning jobs in seconds',
  labelNames: ['platform', 'status'],
  buckets: [1, 5, 10, 30, 60, 120, 300],
  registers: [register]
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  activeConnections.inc();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    });

    httpRequestDuration.observe({
      method: req.method,
      route,
      status_code: res.statusCode
    }, duration);

    activeConnections.dec();
  });

  next();
};

export const metricsHandler = async (req: Request, res: Response): Promise<void> => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

export const trackProvisioningJob = (platform: string, status: string, duration?: number): void => {
  provisioningJobsTotal.inc({ platform, status });
  
  if (duration) {
    provisioningDuration.observe({ platform, status }, duration);
  }
};

export { register };
```

## 5. Security and Compliance

### 5.1 Security Scanning Configuration

**Security Scanning (scripts/security-scan.sh)**
```bash
#!/bin/bash

echo "Running security scans..."

# Dependency vulnerability scan
npm audit --audit-level=high

# Static code analysis with Semgrep
semgrep --config=auto --json --output=security-report.json .

# Docker image security scan with Trivy
trivy image --format json --output image-scan.json ghcr.io/your-org/chat-session-builder-frontend:latest
trivy image --format json --output image-scan.json ghcr.io/your-org/chat-session-builder-server:latest

# OWASP ZAP security scan (for staging environment)
zap-baseline.py -t https://staging.chat-session-builder.com -J zap-report.json

echo "Security scans completed. Check reports for issues."
```

### 5.2 Compliance Configuration

**Compliance Checks (.github/workflows/compliance.yml)**
```yaml
name: Compliance Checks

on:
  schedule:
    - cron: '0 2 * * 1' # Weekly on Mondays
  push:
    branches: [main]

jobs:
  gdpr-compliance:
    name: GDPR Compliance Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Check for GDPR compliance
        run: |
          # Check for data collection practices
          grep -r "localStorage\|sessionStorage\|document.cookie" frontend/src/ || true
          
          # Verify privacy policy references
          grep -r "privacy\|gdpr\|data protection" . || echo "No privacy references found"

  accessibility:
    name: Accessibility Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Run accessibility tests
        run: |
          cd frontend
          npx @axe-core/cli dist/ --save axe-report.json
```

This comprehensive deployment and CI/CD guide provides the foundation for deploying the Chat Session Management Builder application to production with proper monitoring, security, and compliance measures in place.