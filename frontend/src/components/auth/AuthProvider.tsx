import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface User {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
  email?: string;
  provider: 'github' | 'google';
}

interface AuthError {
  code: string;
  message: string;
  details?: string;
}

interface TokenData {
  access_token: string;
  expires_at?: number;
  refresh_token?: string;
  provider: 'github' | 'google';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  login: (provider?: 'github' | 'google') => void;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Check for existing authentication on mount
    checkAuthStatus();
    
    // Handle OAuth callback
    handleOAuthCallback();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const tokenDataStr = localStorage.getItem('auth_token_data');
      if (!tokenDataStr) {
        setIsLoading(false);
        return;
      }

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      
      // Check if token is expired
      if (tokenData.expires_at && tokenData.expires_at < Date.now()) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          logout();
          return;
        }
        return;
      }

      // Verify token with appropriate API
      let userData;
      if (tokenData.provider === 'github') {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error('GitHub token verification failed');
        }
        
        const githubData = await response.json();
        userData = {
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
          throw new Error('Google token verification failed');
        }
        
        const googleData = await response.json();
        userData = {
          id: googleData.id,
          login: googleData.email,
          name: googleData.name,
          avatar_url: googleData.picture,
          email: googleData.email,
          provider: 'google' as const,
        };
      }

      if (userData) {
        setUser(userData);
        setError(null);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setError({
        code: 'AUTH_CHECK_FAILED',
        message: 'Failed to verify authentication status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Exchange code for access token
      exchangeCodeForToken(code, state);
    }
  };

  const exchangeCodeForToken = async (code: string, state: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verify state to prevent CSRF
      const storedStateData = localStorage.getItem('oauth_state_data');
      if (!storedStateData) {
        throw new Error('No stored state found');
      }
      
      const { state: storedState, provider } = JSON.parse(storedStateData);
      if (state !== storedState) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }

      // Exchange code for token via backend API (more secure)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          state,
          provider,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `OAuth exchange failed: ${response.status}`);
      }

      const tokenData = await response.json();
      
      if (tokenData.access_token) {
        // Store token data with expiration
        const authTokenData: TokenData = {
          access_token: tokenData.access_token,
          expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : undefined,
          refresh_token: tokenData.refresh_token,
          provider,
        };
        
        localStorage.setItem('auth_token_data', JSON.stringify(authTokenData));
        localStorage.removeItem('oauth_state_data');
        await checkAuthStatus();
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setError({
        code: 'OAUTH_EXCHANGE_FAILED',
        message: 'Failed to complete authentication',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      localStorage.removeItem('oauth_state_data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = (provider: 'github' | 'google' = 'github') => {
    try {
      // Generate random state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('oauth_state_data', JSON.stringify({ state, provider }));

      const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || window.location.origin;
      let authUrl: URL;
      
      if (provider === 'github') {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        if (!clientId) {
          throw new Error('GitHub client ID not configured');
        }
        
        authUrl = new URL('https://github.com/login/oauth/authorize');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('scope', 'user:email read:user');
        authUrl.searchParams.set('state', state);
      } else if (provider === 'google') {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
          throw new Error('Google client ID not configured');
        }
        
        authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'openid email profile');
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', 'consent');
      }

      setError(null);
      window.location.href = authUrl!.toString();
    } catch (error) {
      console.error('Login initiation error:', error);
      setError({
        code: 'LOGIN_INIT_FAILED',
        message: 'Failed to start authentication process',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      localStorage.removeItem('oauth_state_data');
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token_data');
    localStorage.removeItem('oauth_state_data');
    setUser(null);
    setError(null);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const tokenDataStr = localStorage.getItem('auth_token_data');
      if (!tokenDataStr) {
        return false;
      }

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      if (!tokenData.refresh_token) {
        return false;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: tokenData.refresh_token,
          provider: tokenData.provider,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const newTokenData = await response.json();
      const updatedTokenData: TokenData = {
        ...tokenData,
        access_token: newTokenData.access_token,
        expires_at: newTokenData.expires_in ? Date.now() + (newTokenData.expires_in * 1000) : undefined,
        refresh_token: newTokenData.refresh_token || tokenData.refresh_token,
      };

      localStorage.setItem('auth_token_data', JSON.stringify(updatedTokenData));
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    clearError,
    refreshToken,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};