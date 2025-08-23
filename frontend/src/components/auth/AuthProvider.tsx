import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    checkAuthStatus();
    
    // Handle OAuth callback
    handleOAuthCallback();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('github_access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with GitHub API
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id.toString(),
          login: userData.login,
          name: userData.name || userData.login,
          avatar_url: userData.avatar_url,
          email: userData.email,
        });
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('github_access_token');
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      localStorage.removeItem('github_access_token');
    } finally {
      setIsLoading(false);
    }
  };

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
      
      // Verify state to prevent CSRF
      const storedState = localStorage.getItem('github_oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Note: In a production app, this should be done on your backend
      // For GitHub Pages, we'll use GitHub's direct token exchange
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
          client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('github_access_token', data.access_token);
        localStorage.removeItem('github_oauth_state');
        await checkAuthStatus();
      } else {
        throw new Error('Failed to exchange code for token');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      localStorage.removeItem('github_oauth_state');
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('github_oauth_state', state);

    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || window.location.origin + '/auth/callback';
    
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'user:email read:user');
    authUrl.searchParams.set('state', state);

    window.location.href = authUrl.toString();
  };

  const logout = () => {
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_oauth_state');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
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