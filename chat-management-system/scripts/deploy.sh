#!/bin/bash

# Production Deployment Script for Chat Management System
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting Chat Management System Production Deployment..."

# 1. Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf coverage/

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# 3. Install dev dependencies for build
echo "🔧 Installing build dependencies..."
npm ci

# 4. Run tests
echo "🧪 Running tests..."
npm test

# 5. Type check
echo "🔍 Type checking..."
npm run typecheck

# 6. Build application
echo "🏗️  Building application..."
npm run build

# 7. Create logs directory for PM2
echo "📝 Creating logs directory..."
mkdir -p logs

# 8. Verify build
echo "✅ Verifying build..."
if [ ! -f "dist/server.js" ]; then
    echo "❌ Build failed - server.js not found"
    exit 1
fi

echo "🎉 Deployment preparation complete!"
echo ""
echo "To start the production server:"
echo "  Option 1 (Direct): NODE_ENV=production npm start"
echo "  Option 2 (PM2): pm2 start ecosystem.config.js --env production"
echo ""
echo "Health check endpoint: http://localhost:3000/api/health"
echo "API documentation: http://localhost:3000/api/chat-sessions"