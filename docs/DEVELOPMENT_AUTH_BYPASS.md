# Development Authentication Bypass

## Overview

The development authentication bypass allows you to skip authentication during development, making it easier to test protected endpoints without setting up OAuth or JWT tokens.

## ⚠️ Security Warning

**NEVER USE IN PRODUCTION!** This bypass is only available when:
- `NODE_ENV=development`
- `BYPASS_AUTH=true`

## Quick Setup

### Method 1: Environment Variables (Recommended)

Add to your `server/.env` file:
```bash
# Development Authentication Bypass (NEVER use in production)
BYPASS_AUTH=true
```

### Method 2: Manual Environment

Set environment variables when starting the server:
```bash
NODE_ENV=development BYPASS_AUTH=true npm run dev
```

## Usage

### Simple Development Server

For quick testing, use the simple server:
```bash
cd server
NODE_ENV=development BYPASS_AUTH=true node src/simpleServer.js
```

This creates a minimal Express server with authentication bypass enabled.

### Testing Endpoints

With bypass enabled, protected endpoints return a mock user:

```bash
# Test authentication status
curl http://localhost:8787/api/auth/status

# Get current user (bypassed)
curl http://localhost:8787/api/auth/me

# Check server info
curl http://localhost:8787/
```

## Mock User Details

When bypass is enabled, all authenticated endpoints receive this mock user:

```json
{
  "id": "dev-user-123",
  "email": "dev@example.com", 
  "name": "Development User",
  "role": "admin",
  "provider": "local",
  "emailVerified": true,
  "isActive": true
}
```

## Implementation Details

### Middleware Integration

The bypass works by checking environment variables before JWT validation:

```typescript
// In middleware/auth.ts
if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
  req.user = { /* mock user */ };
  return next();
}
```

### Simple Server Option

For troubleshooting or minimal testing, use the simple server (`src/simpleServer.js`):
- No complex dependencies 
- No TypeScript compilation issues
- Direct Express.js with auth bypass
- Minimal endpoints for testing

## Configuration Files

### Updated Environment Files

The setup process automatically adds `BYPASS_AUTH=true` to:
- `server/.env` (development configuration)

### Make Commands

Use the enhanced Makefile commands:
```bash
# Setup with bypass enabled
make setup

# Start development server with bypass
make dev
```

## Disabling Bypass

To disable the bypass:

1. **Remove from environment**:
   ```bash
   # Comment out or remove from server/.env
   # BYPASS_AUTH=true
   ```

2. **Set to false explicitly**:
   ```bash
   BYPASS_AUTH=false
   ```

3. **Production mode** automatically disables bypass:
   ```bash
   NODE_ENV=production
   ```

## Troubleshooting

### Bypass Not Working

1. **Check environment variables**:
   ```bash
   echo $NODE_ENV
   echo $BYPASS_AUTH
   ```

2. **Verify server logs**:
   - Look for "Auth bypassed for development" messages
   - Check "Authentication bypass: ENABLED" on startup

3. **Test endpoints**:
   ```bash
   # Should return authenticated: true, bypassMode: true
   curl http://localhost:8787/api/auth/status
   ```

### Build Errors with Full Server

If the main TypeScript server has build issues:

1. **Use simple server**:
   ```bash
   NODE_ENV=development BYPASS_AUTH=true node src/simpleServer.js
   ```

2. **Check TypeScript errors**:
   ```bash
   npm run build
   ```

3. **Skip type checking**:
   ```bash
   npx tsx --no-warnings src/index.ts
   ```

## Production Safety

### Automatic Protections

- Bypass only works with `NODE_ENV=development`
- Production mode ignores `BYPASS_AUTH` setting
- Environment validation prevents accidental production use

### Verification

Before deploying to production:

```bash
# Should show bypassMode: false
NODE_ENV=production curl http://localhost:8787/api/auth/status
```

## Related Files

- `server/src/middleware/auth.ts` - Main auth middleware with bypass
- `server/src/middleware/devAuth.ts` - Development-only auth helpers  
- `server/src/simpleServer.js` - Minimal server for testing
- `server/.env` - Development environment configuration
- `docs/ENVIRONMENT_SETUP.md` - Full environment setup guide

## Examples

### Frontend Integration

When using the bypass with a frontend:

```javascript
// Frontend auth check
const response = await fetch('/api/auth/status');
const { authenticated, bypassMode } = await response.json();

if (authenticated && bypassMode) {
  console.log('Development mode - authentication bypassed');
}
```

### API Testing

Use the bypass for API testing:

```bash
# All these work without authentication when bypass is enabled
curl http://localhost:8787/api/auth/me
curl http://localhost:8787/api/protected-endpoint
curl http://localhost:8787/api/admin-only-endpoint
```

---

**Remember**: This bypass is for development convenience only. Always test your authentication system with real tokens before production deployment.