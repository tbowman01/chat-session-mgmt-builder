# Frontend Authentication System

## Overview

This document describes the robust frontend authentication system implemented for the Chat Session Management Builder. The system supports multiple OAuth providers (GitHub and Google) with comprehensive security features, error handling, and user experience enhancements.

## Architecture

### Components

#### 1. AuthProvider (`/src/components/auth/AuthProvider.tsx`)
The main authentication context provider that manages:
- User authentication state
- OAuth flow handling
- Token management and refresh
- Error state management
- Security measures (CSRF protection, state validation)

**Key Features:**
- **Multi-provider Support**: GitHub and Google OAuth
- **Token Security**: Secure token storage with expiration handling
- **Error Handling**: Comprehensive error states with user feedback
- **Token Refresh**: Automatic token refresh before expiration
- **CSRF Protection**: State parameter validation for OAuth flows

#### 2. LoginPage (`/src/components/auth/LoginPage.tsx`)
Enhanced login interface with:
- **Multiple OAuth Providers**: GitHub and Google sign-in options
- **Loading States**: Provider-specific loading indicators
- **Error Display**: Contextual error messages with retry options
- **User Experience**: Clean, responsive design with security indicators

#### 3. PrivateRoute (`/src/components/auth/PrivateRoute.tsx`)
Route protection component featuring:
- **Authentication Guards**: Configurable authentication requirements
- **Session Management**: Session timeout warnings and extension
- **Loading States**: Enhanced loading experiences during token refresh
- **Error Boundaries**: Global authentication error handling

#### 4. UserProfile (`/src/components/layout/UserProfile.tsx`)
User profile dropdown with:
- **Provider-Specific Links**: Context-aware external profile links
- **Session Information**: Token expiration and provider display
- **Logout Management**: Secure logout with loading states
- **Analytics Integration**: User interaction tracking

### Utilities

#### Authentication Utilities (`/src/utils/auth.ts`)
Core utility functions for:
- **Token Management**: Storage, retrieval, and validation
- **OAuth Helpers**: URL building and state management
- **User Info**: Provider-agnostic user data fetching
- **Security**: CSRF state generation and validation
- **Error Handling**: Structured error creation and handling

#### Custom Hooks (`/src/hooks/useAuth.ts`)
React hooks for:
- **Token Refresh**: Automatic token refresh management
- **Error Handling**: Authentication error handling with retry logic
- **Session Timeout**: Configurable session timeout with warnings
- **Persistence**: User data persistence across sessions
- **Analytics**: Authentication event tracking

## Security Features

### 1. CSRF Protection
- Random state parameter generation using `crypto.getRandomValues()`
- State validation on OAuth callback
- Automatic cleanup of invalid states

### 2. Token Security
- Secure token storage in localStorage with structured data
- Token expiration validation
- Automatic token refresh before expiry
- Secure token cleanup on logout

### 3. Provider Validation
- Client ID validation before OAuth initiation
- Provider-specific URL building with validation
- Error handling for misconfigured providers

### 4. Session Management
- Configurable session timeout (default: 30 minutes)
- Activity-based session extension
- Session warning notifications
- Secure session termination

## Configuration

### Environment Variables

```env
# GitHub OAuth Configuration
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:3000

# Google OAuth Configuration  
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_BASE_URL=/

# Environment
NODE_ENV=development
```

### OAuth Provider Setup

#### GitHub OAuth Application
1. Go to GitHub Developer Settings → OAuth Apps
2. Create new OAuth application
3. Set Authorization callback URL to your redirect URI
4. Copy Client ID to `VITE_GITHUB_CLIENT_ID`

#### Google OAuth Application  
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Configure authorized redirect URIs
4. Copy Client ID to `VITE_GOOGLE_CLIENT_ID`

## Usage Examples

### Basic Authentication Check
```tsx
import { useAuth } from '@/components/auth/AuthProvider';

function MyComponent() {
  const { isAuthenticated, user, login } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={() => login('github')}>Sign In</button>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Protected Routes
```tsx
import { PrivateRoute } from '@/components/auth/PrivateRoute';

function App() {
  return (
    <PrivateRoute requireAuth={true} showSessionWarning={true}>
      <MyProtectedComponent />
    </PrivateRoute>
  );
}
```

### Custom Hooks Usage
```tsx
import { useTokenRefresh, useSessionTimeout } from '@/hooks/useAuth';

function MyComponent() {
  const { isRefreshing } = useTokenRefresh();
  const { showWarning, extendSession } = useSessionTimeout(45); // 45 min timeout
  
  return (
    <div>
      {isRefreshing && <div>Refreshing session...</div>}
      {showWarning && (
        <button onClick={extendSession}>Extend Session</button>
      )}
    </div>
  );
}
```

### Error Handling
```tsx
import { useAuthErrorHandler } from '@/hooks/useAuth';

function MyComponent() {
  const { error, canRetry, handleRetry, clearError } = useAuthErrorHandler();
  
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        {canRetry && <button onClick={handleRetry}>Retry</button>}
        <button onClick={clearError}>Dismiss</button>
      </div>
    );
  }
  
  return <div>No errors</div>;
}
```

## API Integration

The frontend authentication system is designed to work with a backend API that handles:

### Required Backend Endpoints

#### `POST /auth/oauth/token`
Exchange OAuth authorization code for access token:
```json
{
  "code": "oauth_authorization_code",
  "state": "csrf_state_parameter", 
  "provider": "github|google"
}
```

#### `POST /auth/refresh`
Refresh an expired access token:
```json
{
  "refresh_token": "refresh_token_value",
  "provider": "github|google"
}
```

### Security Considerations for Backend
- Validate OAuth state parameter on server
- Implement rate limiting for token exchange
- Use HTTPS in production
- Store client secrets securely on server (never in frontend)
- Implement proper CORS policies

## Testing

### Running Tests
```bash
npm run test               # Run all tests
npm run test:coverage     # Run with coverage
npm run test:ui           # Open test UI
```

### Test Coverage
The authentication system includes comprehensive tests for:
- **AuthProvider**: Context state management and OAuth flows
- **Authentication Utilities**: Token management and security functions
- **Custom Hooks**: Hook behavior and side effects
- **Error Scenarios**: Error handling and edge cases

### Test Files
- `/src/__tests__/components/auth/AuthProvider.test.tsx`
- `/src/__tests__/utils/auth.test.ts`

## Performance Considerations

### 1. Token Management
- Tokens stored in localStorage for persistence
- Automatic cleanup of expired tokens
- Minimal token refresh API calls

### 2. Component Optimization  
- React.memo for expensive components
- useCallback for event handlers
- Debounced session activity tracking

### 3. Bundle Size
- Tree-shakable utility functions
- Conditional provider code loading
- Minimal external dependencies

## Troubleshooting

### Common Issues

#### 1. "GitHub client ID not configured" Error
**Solution**: Ensure `VITE_GITHUB_CLIENT_ID` is set in your environment variables.

#### 2. OAuth Callback Not Working
**Solution**: 
- Verify redirect URI matches OAuth app configuration
- Check that `VITE_GITHUB_REDIRECT_URI` is correct
- Ensure backend is handling OAuth token exchange

#### 3. Session Expires Immediately
**Solution**:
- Check token expiration time from OAuth provider
- Verify backend is returning correct `expires_in` value
- Ensure system clock is synchronized

#### 4. CSRF State Validation Failed
**Solution**:
- Check browser's localStorage for corrupted state data
- Clear localStorage and try again
- Verify OAuth flow isn't being interrupted

### Debug Mode
Enable debug logging by setting localStorage:
```javascript
localStorage.setItem('auth_debug', 'true');
```

## Migration Guide

### From Basic Authentication
1. Install new authentication utilities
2. Replace basic auth checks with `useAuth` hook
3. Update login components to use new OAuth providers
4. Add error handling with `useAuthErrorHandler`
5. Configure environment variables for OAuth providers

### Breaking Changes
- Authentication state structure changed (now includes provider info)
- Token storage format updated (includes expiration and refresh tokens)
- OAuth callback handling moved from URL params to backend API

## Future Enhancements

### Planned Features
1. **Additional Providers**: Microsoft, Twitter, LinkedIn OAuth support
2. **Biometric Authentication**: WebAuthn/FIDO2 integration  
3. **Multi-Factor Authentication**: TOTP/SMS verification
4. **Advanced Session Management**: Multiple device management
5. **Social Features**: Profile synchronization and social login

### Contributing
When contributing to the authentication system:
1. Maintain security best practices
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Follow TypeScript strict mode guidelines
5. Ensure accessibility compliance

---

For more information, see the [main project documentation](../README.md) or contact the development team.