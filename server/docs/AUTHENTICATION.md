# Authentication Documentation

## Overview

This document describes the comprehensive authentication system implemented for the Chat Session Management API. The system supports multiple authentication methods including JWT tokens, OAuth providers (GitHub, Google), and role-based access control.

## Architecture

### Core Components

1. **JWT Utilities** (`/src/utils/jwt.ts`)
   - Token generation and validation
   - Password hashing and verification
   - Token blacklisting for security

2. **Authentication Middleware** (`/src/middleware/auth.ts`)
   - Token verification
   - Role-based access control
   - Rate limiting for auth endpoints

3. **User Service** (`/src/services/auth/userService.ts`)
   - In-memory user storage (replace with database in production)
   - Session management
   - User CRUD operations

4. **Authentication Routes** (`/src/routes/auth.ts`)
   - Registration, login, logout endpoints
   - Token refresh functionality
   - User profile management

5. **OAuth Routes** (`/src/routes/oauth.ts`)
   - GitHub and Google OAuth integration
   - Provider linking/unlinking

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "provider": "local",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isActive": true,
    "emailVerified": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

#### POST /api/auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as registration response.

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

#### POST /api/auth/logout
Logout current session.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logged out successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### POST /api/auth/logout-all
Logout from all devices/sessions.

**Headers:**
```
Authorization: Bearer <access_token>
```

#### GET /api/auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "provider": "local",
    "avatar": "https://example.com/avatar.jpg",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "emailVerified": true,
    "isActive": true
  }
}
```

#### GET /api/auth/status
Check authentication status without requiring full authentication.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### OAuth Endpoints

#### GET /api/auth/providers
Get available OAuth providers.

**Response:**
```json
{
  "providers": [
    {
      "name": "github",
      "displayName": "GitHub",
      "authUrl": "/api/auth/github",
      "enabled": true
    },
    {
      "name": "google",
      "displayName": "Google",
      "authUrl": "/api/auth/google",
      "enabled": true
    }
  ],
  "localAuth": true
}
```

#### GET /api/auth/github
Initiate GitHub OAuth flow.

#### GET /api/auth/github/callback
GitHub OAuth callback endpoint.

#### GET /api/auth/google
Initiate Google OAuth flow.

#### GET /api/auth/google/callback
Google OAuth callback endpoint.

#### DELETE /api/auth/unlink/:provider
Unlink OAuth provider from account.

## Security Features

### Token Management

1. **Access Tokens**
   - Short-lived (15 minutes default)
   - Used for API authentication
   - Can be blacklisted for immediate revocation

2. **Refresh Tokens**
   - Long-lived (7 days default)
   - Used to obtain new access tokens
   - Stored securely in database/session store

3. **Token Storage**
   - Secure HTTP-only cookies (recommended)
   - Authorization header support
   - Automatic cleanup of expired tokens

### Password Security

- bcrypt hashing with salt rounds (12)
- Strong password requirements (8+ chars, mixed case, numbers, symbols)
- Password validation on registration

### Rate Limiting

- 5 login attempts per 15 minutes per IP
- Configurable limits for different endpoints
- Prevents brute force attacks

### CORS and Security Headers

- Helmet.js for security headers
- CORS configuration for allowed origins
- CSP headers for XSS protection

## Middleware Usage

### Basic Authentication
```typescript
import { authenticateToken } from './middleware/auth.js';

router.get('/protected', authenticateToken, (req, res) => {
  // req.user is available
  res.json({ user: req.user });
});
```

### Role-Based Access
```typescript
import { requireRole, requireAdmin } from './middleware/auth.js';

// Require specific role
router.get('/admin-only', authenticateToken, requireAdmin, handler);

// Require any of multiple roles
router.get('/staff-only', authenticateToken, requireRole('admin', 'moderator'), handler);
```

### Optional Authentication
```typescript
import { optionalAuth } from './middleware/auth.js';

router.get('/public', optionalAuth, (req, res) => {
  // req.user may or may not be present
  if (req.user) {
    // Authenticated behavior
  } else {
    // Anonymous behavior
  }
});
```

### Resource Ownership
```typescript
import { requireOwnership } from './middleware/auth.js';

router.get('/users/:userId/data', authenticateToken, requireOwnership, handler);
// Only allows access if req.user.id === req.params.userId or user is admin
```

## Configuration

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-in-production
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
JWT_ISSUER=chat-session-mgmt-api
JWT_AUDIENCE=chat-session-mgmt-client

# OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:8787/api/auth/github/callback

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8787/api/auth/google/callback

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-in-production
SESSION_MAX_AGE=604800000

# Frontend URL for OAuth redirects
FRONTEND_URL=http://localhost:5173

# API Key for service-to-service communication
API_KEY=your-api-key-for-service-calls
```

## Error Handling

All authentication endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Detailed error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `USER_EXISTS` - User already registered
- `INVALID_CREDENTIALS` - Wrong email/password
- `MISSING_TOKEN` - No authentication token provided
- `INVALID_TOKEN` - Token is invalid or expired
- `BLACKLISTED_TOKEN` - Token has been revoked
- `INSUFFICIENT_ROLE` - User lacks required permissions
- `OWNERSHIP_VIOLATION` - User cannot access resource
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Testing

Comprehensive test suite covers:

- User registration and login flows
- Token generation and validation
- Middleware functionality
- Error handling
- Rate limiting
- OAuth flows (mocked)

Run tests:
```bash
npm test
npm run test:watch
```

## Production Considerations

1. **Database Integration**
   - Replace in-memory user service with database
   - Implement proper session storage (Redis recommended)
   - Add user indexing for performance

2. **Security Enhancements**
   - Implement email verification
   - Add 2FA support
   - Use secure session storage
   - Implement CSRF protection

3. **Monitoring**
   - Log all authentication events
   - Monitor failed login attempts
   - Track token usage patterns

4. **Scaling**
   - Use distributed session store
   - Implement token rotation
   - Add API rate limiting by user

## Client Integration

### JavaScript/TypeScript Example

```typescript
class AuthService {
  private baseUrl = 'http://localhost:8787/api/auth';

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details);
    }

    return response.json();
  }

  async getProfile() {
    const response = await fetch(`${this.baseUrl}/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  }

  async logout() {
    await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  }
}
```

This authentication system provides a robust foundation for secure user management with modern best practices and comprehensive feature coverage.