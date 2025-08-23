# Deployment Guide

## 🚀 Deployment Overview

The Chat Session Management Builder supports multiple deployment strategies for different environments and use cases. This guide covers all deployment options from local development to enterprise production.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [GitHub Pages Deployment](#github-pages-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Deployments](#cloud-deployments)
6. [Environment Configuration](#environment-configuration)
7. [Monitoring & Health Checks](#monitoring--health-checks)
8. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements
- **Node.js**: 22 LTS or later
- **npm**: 10.0.0 or later
- **Git**: Latest version
- **Docker**: 20.10+ (for containerized deployment)
- **Docker Compose**: 2.0+ (for local orchestration)

### Development Tools
- **GitHub CLI**: For repository management
- **VS Code**: Recommended IDE with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Docker
  - GitHub Actions

## 🏠 Local Development

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/tbowman01/chat-session-mgmt-builder.git
cd chat-session-mgmt-builder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp frontend/.env.example frontend/.env.local
cp server/.env.example server/.env.local

# 4. Start development servers
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8787

### Manual Setup

```bash
# Frontend development
cd frontend
npm install
npm run dev

# Backend development (in another terminal)
cd server
npm install
npm run dev
```

### Development Configuration

Create `frontend/.env.local`:
```env
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_id
VITE_GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_API_BASE_URL=http://localhost:8787/api
VITE_BASE_URL=/
```

Create `server/.env.local`:
```env
NODE_ENV=development
PORT=8787
CORS_ORIGIN=http://localhost:3000
NOTION_API_KEY=your_notion_integration_token
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

## 🌐 GitHub Pages Deployment

### Automatic Deployment

The project is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** triggers deployment
2. **GitHub Actions** builds and deploys the frontend
3. **Live URL**: https://tbowman01.github.io/chat-session-mgmt-builder/

### Manual Deployment

```bash
# Trigger manual deployment
gh workflow run github-pages.yml

# Check deployment status
gh run list --limit 3
gh run view <run-id>
```

### GitHub Pages Configuration

The deployment workflow is configured in `.github/workflows/github-pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run build:frontend
        env:
          VITE_BASE_URL: /chat-session-mgmt-builder/
          VITE_API_BASE_URL: https://api.yourdomain.com
          VITE_GITHUB_CLIENT_ID: ${{ secrets.GITHUB_CLIENT_ID }}
```

### Environment Secrets

Configure these secrets in GitHub repository settings:

- `GITHUB_CLIENT_ID`: OAuth application client ID
- `NOTION_API_KEY`: Notion integration token (if used)
- `AIRTABLE_API_KEY`: Airtable API key (if used)

## 🐳 Docker Deployment

### Quick Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This starts:
- **Frontend**: http://localhost:3000 (Nginx)
- **Backend**: http://localhost:8787 (Node.js)

### Individual Container Deployment

#### Frontend Container

```bash
# Build frontend image
cd frontend
docker build -t chat-builder-frontend .

# Run frontend container
docker run -p 3000:80 \
  -e VITE_API_BASE_URL=http://localhost:8787/api \
  chat-builder-frontend
```

#### Backend Container

```bash
# Build backend image
cd server
docker build -t chat-builder-backend .

# Run backend container
docker run -p 8787:8787 \
  -e NODE_ENV=production \
  -e NOTION_API_KEY=your_key \
  chat-builder-backend
```

### Docker Production Configuration

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "8787:8787"
    environment:
      - NODE_ENV=production
      - NOTION_API_KEY=${NOTION_API_KEY}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/private
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

## ☁️ Cloud Deployments

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Deploy production
vercel --prod
```

Configure `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "server/package.json",
      "use": "@vercel/node",
      "config": { "includeFiles": ["dist/**"] }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build:frontend
netlify deploy --dir=frontend/dist

# Deploy to production
netlify deploy --prod --dir=frontend/dist
```

Configure `netlify.toml`:

```toml
[build]
  base = "frontend"
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "22"
  NPM_VERSION = "10"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-api.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway link
railway up
```

Configure `railway.toml`:

```toml
[build]
  builder = "nixpacks"

[deploy]
  healthcheckPath = "/health"
  healthcheckTimeout = 30
  restartPolicyType = "on_failure"
  restartPolicyMaxRetries = 3

[env]
  NODE_ENV = "production"
  PORT = "8787"
```

### AWS Deployment

#### Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize application
eb init chat-session-builder

# Create environment
eb create production

# Deploy
eb deploy
```

#### ECS with Fargate

Create `aws-task-definition.json`:

```json
{
  "family": "chat-session-builder",
  "networkMode": "awsvpc",
  "requiresAttributes": [
    {
      "name": "com.amazonaws.ecs.capability.docker-remote-api.1.18"
    }
  ],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/chat-builder-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true
    },
    {
      "name": "backend", 
      "image": "your-account.dkr.ecr.region.amazonaws.com/chat-builder-backend:latest",
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
        }
      ],
      "essential": true
    }
  ]
}
```

## ⚙️ Environment Configuration

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth app ID | - | Yes |
| `VITE_GITHUB_REDIRECT_URI` | OAuth redirect URL | `/auth/callback` | Yes |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8787/api` | Yes |
| `VITE_BASE_URL` | Application base path | `/` | No |

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `8787` | No |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` | No |
| `NOTION_API_KEY` | Notion integration token | - | Optional |
| `AIRTABLE_API_KEY` | Airtable API key | - | Optional |
| `AIRTABLE_BASE_ID` | Airtable base ID | - | Optional |

### Production Environment Setup

Create production environment files:

**.env.production** (Frontend):
```env
VITE_GITHUB_CLIENT_ID=your_production_client_id
VITE_GITHUB_REDIRECT_URI=https://yourdomain.com/auth/callback
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_BASE_URL=/
NODE_ENV=production
```

**.env.production** (Backend):
```env
NODE_ENV=production
PORT=8787
CORS_ORIGIN=https://yourdomain.com
NOTION_API_KEY=secret_notion_token
AIRTABLE_API_KEY=key_airtable_token
AIRTABLE_BASE_ID=app_base_id
LOG_LEVEL=warn
RATE_LIMIT_MAX=1000
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints

The backend provides comprehensive health checks:

```bash
# Basic health check
curl http://localhost:8787/health

# Detailed health information
curl http://localhost:8787/health?detailed=true
```

Response format:
```json
{
  "status": "healthy",
  "timestamp": "2025-08-23T20:00:00.000Z",
  "uptime": 3600,
  "version": "2.0.0",
  "environment": "production",
  "checks": {
    "database": "healthy",
    "external_apis": "healthy",
    "memory": {
      "rss": 45678592,
      "heapTotal": 32505856,
      "heapUsed": 28987456,
      "external": 1876234
    },
    "cpu": {
      "user": 125000,
      "system": 50000
    }
  }
}
```

### Docker Health Checks

Frontend health check:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1
```

Backend health check:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8787/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"
```

### Monitoring with Docker Compose

```yaml
services:
  backend:
    # ... other configuration
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:8787/health')"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
    depends_on:
      - redis
    restart: unless-stopped
```

### Application Metrics

Monitor key metrics:

```bash
# Check application logs
docker-compose logs -f backend

# Monitor resource usage
docker stats

# Check container health
docker-compose ps
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

**Issue**: TypeScript compilation errors
```bash
# Check TypeScript configuration
npm run typecheck

# Fix common issues
npm run lint -- --fix
```

**Issue**: Missing dependencies
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Deployment Issues

**Issue**: GitHub Pages deployment fails
```bash
# Check workflow logs
gh run list --limit 5
gh run view <run-id> --log-failed

# Common fixes
# 1. Check environment variables
# 2. Verify build command
# 3. Check file permissions
```

**Issue**: Docker container won't start
```bash
# Check container logs
docker-compose logs backend

# Common issues:
# 1. Port conflicts: Change ports in docker-compose.yml
# 2. Environment variables: Check .env files
# 3. Memory limits: Increase Docker memory allocation
```

#### Runtime Issues

**Issue**: Authentication not working
```bash
# Check OAuth configuration
# 1. Verify GITHUB_CLIENT_ID
# 2. Check redirect URI matches GitHub app
# 3. Ensure HTTPS in production
```

**Issue**: API calls failing
```bash
# Check CORS configuration
# 1. Verify CORS_ORIGIN matches frontend URL
# 2. Check API base URL in frontend config
# 3. Ensure backend is running and accessible
```

### Debug Mode

Enable debug logging:

```bash
# Frontend debug
VITE_DEBUG=true npm run dev

# Backend debug  
LOG_LEVEL=debug npm run dev
```

### Performance Issues

Monitor and optimize:

```bash
# Analyze bundle size
npm run build
npm run analyze

# Check backend performance
npm run dev
# Visit http://localhost:8787/health
```

### Database Connection Issues

```bash
# Test Notion API connection
curl -H "Authorization: Bearer secret_token" \
     -H "Notion-Version: 2022-06-28" \
     https://api.notion.com/v1/users

# Test Airtable connection  
curl -H "Authorization: Bearer key_token" \
     https://api.airtable.com/v0/meta/bases
```

## 🚀 Production Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Load testing completed
- [ ] Security scan passed

### Deployment
- [ ] Build successful
- [ ] Health checks passing
- [ ] HTTPS configured
- [ ] CDN configured
- [ ] Domain DNS configured
- [ ] Error tracking enabled

### Post-Deployment
- [ ] Application accessible
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] Monitoring active
- [ ] Backups running
- [ ] Performance acceptable

## 📚 Additional Resources

### Documentation Links
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Docker Documentation](https://docs.docker.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)

### Monitoring Tools
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- [DataDog](https://www.datadoghq.com/) - Infrastructure monitoring
- [New Relic](https://newrelic.com/) - Application monitoring

### Performance Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Web performance
- [WebPageTest](https://www.webpagetest.org/) - Website speed test
- [GTmetrix](https://gtmetrix.com/) - Performance analysis

---

This deployment guide covers all major deployment scenarios. For specific questions or custom deployment requirements, refer to the platform-specific documentation or open an issue in the GitHub repository.