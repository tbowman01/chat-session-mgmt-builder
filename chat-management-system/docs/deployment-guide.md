# Chat Management System API Deployment Guide

## Quick Deployment

### Automated Deployment
```bash
# Run the deployment script
./scripts/deploy.sh
```

### Manual Deployment Steps
```bash
# 1. Build the application
npm run build

# 2. Start production server
NODE_ENV=production npm start
```

## Environment Configuration

### Required Environment Variables
- `NODE_ENV`: Set to 'production'
- `PORT`: Application port (default: 3000)

### Optional Environment Variables
- `CORS_ORIGIN`: Allowed CORS origins (default: false)
- `CORS_CREDENTIALS`: Enable CORS credentials (default: false)
- `RATE_LIMIT_WINDOW_MS`: Rate limit time window (default: 60000)
- `RATE_LIMIT_MAX`: Maximum requests per window (default: 100)
- `MAX_CHATS`: Maximum chat sessions per instance (default: 10000)

## Production Deployment Options

### Option 1: Direct Node.js
```bash
NODE_ENV=production node dist/server.js
```

### Option 2: PM2 Process Manager
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Setup PM2 to start on system boot
pm2 startup
pm2 save
```

### Option 3: Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
```

## Health Monitoring

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

Expected Response:
```json
{
  "name": "Chat Management System API",
  "version": "1.0.0",
  "environment": "production",
  "endpoints": {
    "health": "/api/health",
    "chats": "/api/chats",
    "docs": "/api/chats (GET, POST, PUT, DELETE)"
  }
}
```

## Security Checklist

- [x] Helmet.js security headers enabled
- [x] CORS properly configured
- [x] Rate limiting implemented
- [x] Input validation with Joi schemas
- [x] Error handling without sensitive data exposure
- [x] Environment-based logging

## Performance Monitoring

### Key Metrics to Monitor
- Response time
- Memory usage
- Request rate
- Error rate
- Active connections

### PM2 Monitoring
```bash
pm2 monit
pm2 logs chat-management-api
pm2 status
```

## Scaling Considerations

### Horizontal Scaling
- Each instance maintains independent in-memory storage
- Load balancer should use round-robin distribution
- No session affinity required

### Vertical Scaling
- Monitor memory usage (increases with chat session count)
- Default limit: 10,000 chat sessions per instance
- Configurable via MAX_TODOS environment variable