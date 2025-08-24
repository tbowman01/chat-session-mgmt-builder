/**
 * Authentication utilities for token management and validation
 */

export interface TokenData {
  access_token: string;
  expires_at?: number;
  refresh_token?: string;
  provider: 'github' | 'google';
}

export interface AuthError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Storage keys for authentication data
 */
export const AUTH_STORAGE_KEYS = {
  TOKEN_DATA: 'auth_token_data',
  OAUTH_STATE: 'oauth_state_data',
} as const;

/**
 * Get stored token data from localStorage
 */
export const getStoredTokenData = (): TokenData | null => {
  try {
    const tokenDataStr = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN_DATA);
    if (!tokenDataStr) return null;
    
    const tokenData: TokenData = JSON.parse(tokenDataStr);
    return tokenData;
  } catch (error) {
    console.error('Failed to parse stored token data:', error);
    return null;
  }
};

/**
 * Store token data in localStorage
 */
export const storeTokenData = (tokenData: TokenData): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN_DATA, JSON.stringify(tokenData));
  } catch (error) {
    console.error('Failed to store token data:', error);
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_DATA);
  localStorage.removeItem(AUTH_STORAGE_KEYS.OAUTH_STATE);
};

/**
 * Check if a token is expired
 */
export const isTokenExpired = (tokenData: TokenData): boolean => {
  if (!tokenData.expires_at) return false;
  return tokenData.expires_at < Date.now();
};

/**
 * Check if a token will expire within the specified number of minutes
 */
export const willTokenExpireSoon = (tokenData: TokenData, minutesBeforeExpiry: number = 5): boolean => {
  if (!tokenData.expires_at) return false;
  const expiryThreshold = Date.now() + (minutesBeforeExpiry * 60 * 1000);
  return tokenData.expires_at < expiryThreshold;
};

/**
 * Generate a secure random state for OAuth flow
 */
export const generateOAuthState = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate OAuth state to prevent CSRF attacks
 */
export const validateOAuthState = (receivedState: string): { isValid: boolean; provider?: 'github' | 'google' } => {
  try {
    const storedStateData = localStorage.getItem(AUTH_STORAGE_KEYS.OAUTH_STATE);
    if (!storedStateData) {
      return { isValid: false };
    }
    
    const { state: storedState, provider } = JSON.parse(storedStateData);
    return {
      isValid: receivedState === storedState,
      provider,
    };
  } catch (error) {
    console.error('Failed to validate OAuth state:', error);
    return { isValid: false };
  }
};

/**
 * Build OAuth authorization URL for different providers
 */
export const buildOAuthUrl = (provider: 'github' | 'google', state: string): string | null => {
  const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || window.location.origin;
  
  try {
    if (provider === 'github') {
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      if (!clientId) {
        throw new Error('GitHub client ID not configured');
      }
      
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'user:email read:user');
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('prompt', 'consent');
      
      return authUrl.toString();
    } else if (provider === 'google') {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google client ID not configured');
      }
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'openid email profile');
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      
      return authUrl.toString();
    }
  } catch (error) {
    console.error(`Failed to build ${provider} OAuth URL:`, error);
  }
  
  return null;
};

/**
 * Get user info from provider API using access token
 */
export const getUserInfo = async (tokenData: TokenData) => {
  if (tokenData.provider === 'github') {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const githubData = await response.json();
    return {
      id: githubData.id.toString(),
      login: githubData.login,
      name: githubData.name || githubData.login,
      avatar_url: githubData.avatar_url,
      email: githubData.email,
      provider: 'github' as const,
    };
  } else if (tokenData.provider === 'google') {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }
    
    const googleData = await response.json();
    return {
      id: googleData.id,
      login: googleData.email,
      name: googleData.name,
      avatar_url: googleData.picture,
      email: googleData.email,
      provider: 'google' as const,
    };
  }
  
  throw new Error(`Unsupported provider: ${tokenData.provider}`);
};

/**
 * Create an auth error object with consistent structure
 */
export const createAuthError = (code: string, message: string, details?: string): AuthError => ({
  code,
  message,
  details,
});

/**
 * Handle fetch errors and convert to auth errors
 */
export const handleFetchError = (error: unknown, defaultMessage: string): AuthError => {
  if (error instanceof Error) {
    return createAuthError('FETCH_ERROR', defaultMessage, error.message);
  }
  
  return createAuthError('UNKNOWN_ERROR', defaultMessage, 'An unknown error occurred');
};