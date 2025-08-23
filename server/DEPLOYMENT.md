# Deployment Guide

This document provides comprehensive deployment instructions for the Chat Session Management Builder API.

## 🚀 Quick Start

### Development Deployment

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Update with your API tokens
NOTION_TOKEN=secret_your_token_here
AIRTABLE_TOKEN=pat_your_token_here

# 3. Deploy with Docker Compose
./scripts/deploy.sh dev
```

### Production Deployment

```bash
# 1. Run tests and build
./scripts/deploy.sh test
./scripts/deploy.sh build

# 2. Deploy to production
./scripts/deploy.sh prod
```

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Notion integration token
- Airtable personal access token

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# API Tokens (Required)
NOTION_TOKEN=secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Server Configuration
NODE_ENV=production
PORT=8787
API_VERSION=2.0.0

# CORS Configuration
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_MAX_CONCURRENT=10

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/server.log

# Security
SESSION_SECRET=your-secure-session-secret-here
HELMET_CSP_ENABLED=true

# Redis (optional)
REDIS_PASSWORD=your-redis-password
```

## 🐳 Docker Deployment

### Development

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f api
```

### Production

```bash
# Start production services with Nginx
docker-compose --profile production up -d

# Check status
docker-compose ps
```

## ☸️ Kubernetes Deployment

### Basic Deployment

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: chat-session-mgmt

---
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
  namespace: chat-session-mgmt
type: Opaque
stringData:
  notion-token: secret_your_token_here
  airtable-token: pat_your_token_here
  session-secret: your-session-secret

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: chat-session-mgmt
data:
  NODE_ENV: "production"
  PORT: "8787"
  API_VERSION: "2.0.0"
  LOG_LEVEL: "info"
  ALLOWED_ORIGINS: "https://your-domain.com"

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chat-session-api
  namespace: chat-session-mgmt
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chat-session-api
  template:
    metadata:
      labels:
        app: chat-session-api
    spec:
      containers:
      - name: api
        image: your-registry/chat-session-api:latest
        ports:
        - containerPort: 8787
        envFrom:
        - configMapRef:
            name: api-config
        env:
        - name: NOTION_TOKEN
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: notion-token
        - name: AIRTABLE_TOKEN
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: airtable-token
        - name: SESSION_SECRET
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: session-secret
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8787
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8787
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: logs
        emptyDir: {}

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: chat-session-api-service
  namespace: chat-session-mgmt
spec:
  selector:
    app: chat-session-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8787
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: chat-session-api-ingress
  namespace: chat-session-mgmt
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "60"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.your-domain.com
    secretName: api-tls
  rules:
  - host: api.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: chat-session-api-service
            port:
              number: 80
```

### Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment
kubectl get pods -n chat-session-mgmt

# View logs
kubectl logs -f deployment/chat-session-api -n chat-session-mgmt
```

## 🌐 Cloud Deployment

### AWS ECS

```json
{
  "family": "chat-session-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "your-account.dkr.ecr.region.amazonaws.com/chat-session-api:latest",
      "portMappings": [
        {
          "containerPort": 8787,
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
          "value": "8787"
        }
      ],
      "secrets": [
        {
          "name": "NOTION_TOKEN",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:notion-token"
        },
        {
          "name": "AIRTABLE_TOKEN",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:airtable-token"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/chat-session-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:8787/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

### Google Cloud Run

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: chat-session-api
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 1000
      containers:
      - image: gcr.io/project-id/chat-session-api:latest
        ports:
        - containerPort: 8787
        env:
        - name: NODE_ENV
          value: production
        - name: PORT
          value: "8787"
        - name: NOTION_TOKEN
          valueFrom:
            secretKeyRef:
              key: notion-token
              name: api-secrets
        - name: AIRTABLE_TOKEN
          valueFrom:
            secretKeyRef:
              key: airtable-token
              name: api-secrets
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
          requests:
            cpu: "0.1"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8787
          initialDelaySeconds: 30
        startupProbe:
          httpGet:
            path: /health/ready
            port: 8787
          initialDelaySeconds: 5
```

## 🔍 Monitoring & Logging

### Prometheus Metrics

```yaml
# k8s/servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: chat-session-api
spec:
  selector:
    matchLabels:
      app: chat-session-api
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Chat Session API",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      }
    ]
  }
}
```

## 🛠️ Maintenance

### Health Checks

```bash
# Basic health check
curl http://localhost:8787/health

# Detailed health check
curl http://localhost:8787/health/detailed

# Check specific endpoints
curl -X POST http://localhost:8787/api/provision/notion/test
```

### Log Management

```bash
# View live logs
docker-compose logs -f api

# Export logs
docker-compose logs api > api-logs.txt

# Rotate logs
docker-compose exec api logrotate /etc/logrotate.conf
```

### Backup & Recovery

```bash
# Create backup
./scripts/deploy.sh backup

# View backups
ls -la backups/

# Restore from backup
cp backups/20240322_120000/env.backup .env
```

## 🚨 Troubleshooting

### Common Issues

**1. Container won't start**
```bash
# Check logs
docker-compose logs api

# Check environment variables
docker-compose exec api env | grep -E "(NOTION|AIRTABLE)"
```

**2. API returns 500 errors**
```bash
# Check API token validity
curl -H "Authorization: Bearer $NOTION_TOKEN" https://api.notion.com/v1/users

# Check Airtable connection
curl -H "Authorization: Bearer $AIRTABLE_TOKEN" https://api.airtable.com/v0/meta/bases
```

**3. High memory usage**
```bash
# Monitor memory
docker stats

# Check for memory leaks
docker-compose exec api node -e "console.log(process.memoryUsage())"
```

### Performance Tuning

```bash
# Adjust container resources
docker-compose up --scale api=3

# Monitor performance
docker-compose exec api npm run benchmark
```

## 🔒 Security Checklist

- [ ] API tokens stored in secrets/environment variables
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] Input validation active
- [ ] Logs don't contain sensitive data
- [ ] Container runs as non-root user
- [ ] Regular security updates applied

## 📊 Scaling

### Horizontal Scaling

```bash
# Scale with Docker Compose
docker-compose up --scale api=3

# Scale in Kubernetes
kubectl scale deployment chat-session-api --replicas=5
```

### Load Balancing

```nginx
upstream api_backend {
    server api-1:8787;
    server api-2:8787;
    server api-3:8787;
}
```

This deployment guide covers all major deployment scenarios and operational concerns for the Chat Session Management Builder API.