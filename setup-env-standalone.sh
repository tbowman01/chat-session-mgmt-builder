#!/bin/bash

# Standalone environment setup script
# This can be used independently or called from Makefile

echo "🔐 Setting up environment configuration files..."

# Create server/.env
if [ ! -f server/.env ]; then
    echo "📄 Creating server/.env from template..."
    
    # Generate unique secrets based on current timestamp
    TIMESTAMP=$(date +%s)
    
    cat > server/.env <<EOF
# Chat Session Management Builder - Development Environment
NODE_ENV=development
PORT=8787
API_VERSION=v1

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# JWT Configuration (Change in Production)
JWT_SECRET=development-jwt-secret-key-change-in-production-${TIMESTAMP}
REFRESH_TOKEN_SECRET=development-refresh-token-secret-change-in-production-${TIMESTAMP}
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
JWT_ISSUER=chat-session-mgmt-builder
JWT_AUDIENCE=chat-session-mgmt-users

# Session Configuration
SESSION_SECRET=development-session-secret-change-in-production-${TIMESTAMP}
SESSION_MAX_AGE=86400000

# OAuth Configuration (GitHub)
# Get your keys from: https://github.com/settings/applications/new
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
GITHUB_CALLBACK_URL=http://localhost:8787/api/auth/github/callback

# OAuth Configuration (Google)
# Get your keys from: https://console.developers.google.com/
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:8787/api/auth/google/callback

# Third-party Service Tokens
# Notion: Get token from https://www.notion.so/my-integrations
NOTION_TOKEN=secret_demo_token_for_development_testing_only
# Airtable: Get token from https://airtable.com/create/tokens
AIRTABLE_TOKEN=pat_demo_token_for_development_testing

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_MAX_CONCURRENT=10

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log
EOF
    echo "✅ Created server/.env with development defaults"
else
    echo "✅ server/.env already exists"
fi

# Create frontend/.env
if [ ! -f frontend/.env ]; then
    echo "📄 Creating frontend/.env..."
    
    cat > frontend/.env <<EOF
# Chat Session Management Builder - Frontend Environment
# Backend API URL
VITE_API_BASE_URL=http://localhost:8787/api

# Development settings
VITE_APP_ENV=development
VITE_APP_VERSION=2.0.0

# OAuth Redirect URLs (must match backend)
VITE_GITHUB_REDIRECT_URL=http://localhost:3000/auth/github/callback
VITE_GOOGLE_REDIRECT_URL=http://localhost:3000/auth/google/callback
EOF
    echo "✅ Created frontend/.env"
else
    echo "✅ frontend/.env already exists"
fi

echo ""
echo "🔑 Environment Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. For OAuth features, update these values in server/.env:"
echo "     GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET"
echo "     GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET"
echo "  2. For production APIs, replace demo tokens:"
echo "     NOTION_TOKEN (https://www.notion.so/my-integrations)"
echo "     AIRTABLE_TOKEN (https://airtable.com/create/tokens)"
echo "  3. Run 'make install' to install dependencies"
echo ""