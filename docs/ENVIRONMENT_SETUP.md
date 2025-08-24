# Environment Setup Guide

## Quick Setup

The easiest way to set up your development environment:

```bash
# Complete setup (includes environment files)
make setup

# Or just create environment files
make setup-env
```

## What Gets Created

### Server Environment (`server/.env`)

Complete backend configuration with:
- **JWT Authentication**: Unique development secrets
- **OAuth Setup**: GitHub & Google OAuth placeholders
- **API Tokens**: Demo tokens for Notion & Airtable
- **Security Settings**: CORS, rate limiting, logging

**Key Features**:
- ✅ Unique secrets generated each time (timestamp-based)
- ✅ Development-ready defaults
- ✅ Clear instructions for production setup
- ✅ All authentication middleware configured

### Frontend Environment (`frontend/.env`)

Frontend configuration with:
- **API Integration**: Backend connection (`http://localhost:8787/api`)
- **OAuth Redirects**: Proper callback URLs
- **Development Settings**: Version and environment info

## Manual Setup

If you prefer manual setup or need to customize:

### 1. Server Configuration

Copy the example and customize:
```bash
cp server/.env.example server/.env
```

**Required Changes for Production**:
```bash
# Replace with secure random strings
JWT_SECRET=your-super-secure-jwt-secret-here
REFRESH_TOKEN_SECRET=your-super-secure-refresh-secret-here
SESSION_SECRET=your-super-secure-session-secret-here

# OAuth Credentials (for social login)
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-secret

# API Tokens (for integrations)
NOTION_TOKEN=secret_your-notion-integration-token
AIRTABLE_TOKEN=pat_your-airtable-personal-access-token
```

### 2. Frontend Configuration

```bash
# Create frontend/.env
VITE_API_BASE_URL=http://localhost:8787/api
VITE_APP_ENV=development
VITE_APP_VERSION=2.0.0
```

## OAuth Setup Guides

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App:
   - **Application name**: `Chat Session Management Builder (Dev)`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:8787/api/auth/github/callback`
3. Copy Client ID and Client Secret to `server/.env`

### Google OAuth

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - **Authorized origins**: `http://localhost:8787`
   - **Authorized redirect URIs**: `http://localhost:8787/api/auth/google/callback`
5. Copy Client ID and Client Secret to `server/.env`

## API Tokens Setup

### Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create new integration:
   - **Name**: `Chat Session Manager`
   - **Type**: Internal
   - **Capabilities**: Read content, Update content, Insert content
3. Copy the Integration Token (starts with `secret_`)
4. Share your database/page with the integration

### Airtable Personal Access Token

1. Go to [Airtable Tokens](https://airtable.com/create/tokens)
2. Create new token:
   - **Name**: `Chat Session Builder`
   - **Scopes**: `data.records:read`, `data.records:write`, `schema.bases:read`
3. Copy the token (starts with `pat`)

## Environment Validation

Test your environment setup:

```bash
# Check if server starts correctly
cd server && npm run dev

# Verify health endpoint
curl http://localhost:8787/health

# Expected response:
{
  "ok": true,
  "timestamp": "2025-08-24T...",
  "version": "v1",
  "environment": "development"
}
```

## Security Notes

### Development vs Production

**Development** (auto-generated):
- Predictable secrets (timestamp-based)
- Demo API tokens
- Permissive CORS settings
- Debug logging enabled

**Production** (manual setup required):
- Cryptographically secure secrets
- Real OAuth credentials
- Real API tokens  
- Restricted CORS origins
- Error-level logging

### Secret Generation

For production, generate secure secrets:

```bash
# Generate secure random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use openssl
openssl rand -hex 32
```

## Troubleshooting

### Common Issues

**Issue**: Server won't start - "Invalid NOTION_TOKEN format"
```bash
# Solution: Ensure token starts with "secret_"
NOTION_TOKEN=secret_your_actual_token_here
```

**Issue**: OAuth redirect errors
```bash
# Solution: Ensure callback URLs match exactly
# Backend: http://localhost:8787/api/auth/github/callback
# Frontend: http://localhost:3000/auth/github/callback
```

**Issue**: CORS errors in browser
```bash
# Solution: Check ALLOWED_ORIGINS includes your frontend URL
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Validation Commands

```bash
# Check environment files exist
ls server/.env frontend/.env

# Validate server configuration
cd server && npm run typecheck

# Test API connectivity
curl http://localhost:8787/health
```

## Development Workflow

1. **First time setup**:
   ```bash
   make setup      # Creates .env files + installs deps
   ```

2. **Daily development**:
   ```bash
   make dev        # Starts both frontend & backend
   ```

3. **Reset environment**:
   ```bash
   rm server/.env frontend/.env
   make setup-env  # Recreate with fresh secrets
   ```

---

**Setup Status**: ✅ Automated environment file creation  
**Security**: ✅ Development defaults + production guidance  
**Integration**: ✅ OAuth & API token setup documented