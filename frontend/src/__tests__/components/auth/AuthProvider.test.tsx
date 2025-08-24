import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../../components/auth/AuthProvider';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_GITHUB_CLIENT_ID: 'test-github-client-id',
    VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
    VITE_GITHUB_REDIRECT_URI: 'http://localhost:3000',
    VITE_API_BASE_URL: 'http://localhost:3001/api',
  }
}));

// Test component to access useAuth hook
const TestComponent = () => {
  const { user, isLoading, error, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user">{user ? user.name : 'no-user'}</div>
      <div data-testid="error">{error ? error.message : 'no-error'}</div>
      <button data-testid="login-github" onClick={() => login('github')}>Login GitHub</button>
      <button data-testid="login-google" onClick={() => login('google')}>Login Google</button>
      <button data-testid="logout" onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock window.location
    delete (window as any).location;
    window.location = { href: '', search: '', origin: 'http://localhost:3000' } as any;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render with initial loading state', () => {
    renderWithAuthProvider();
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should handle successful GitHub authentication', async () => {
    const mockUserData = {
      id: 123,
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://avatars.githubusercontent.com/u/123',
      email: 'test@example.com'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    // Mock stored token data
    const tokenData = {
      access_token: 'test-token',
      provider: 'github',
      expires_at: Date.now() + 3600000,
    };
    localStorage.setItem('auth_token_data', JSON.stringify(tokenData));

    await act(async () => {
      renderWithAuthProvider();
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/user', {
      headers: {
        Authorization: 'Bearer test-token',
        Accept: 'application/vnd.github.v3+json',
      },
    });
  });

  it('should handle successful Google authentication', async () => {
    const mockUserData = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://lh3.googleusercontent.com/a/test',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    // Mock stored token data for Google
    const tokenData = {
      access_token: 'test-google-token',
      provider: 'google',
      expires_at: Date.now() + 3600000,
    };
    localStorage.setItem('auth_token_data', JSON.stringify(tokenData));

    await act(async () => {
      renderWithAuthProvider();
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    expect(mockFetch).toHaveBeenCalledWith('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: 'Bearer test-google-token',
      },
    });
  });

  it('should handle authentication error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    // Mock invalid token data
    const tokenData = {
      access_token: 'invalid-token',
      provider: 'github',
    };
    localStorage.setItem('auth_token_data', JSON.stringify(tokenData));

    await act(async () => {
      renderWithAuthProvider();
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to verify authentication status');
    });
  });

  it('should handle GitHub login initiation', async () => {
    const user = userEvent.setup();
    
    renderWithAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    await act(async () => {
      await user.click(screen.getByTestId('login-github'));
    });

    // Check if localStorage has the OAuth state
    const storedState = localStorage.getItem('oauth_state_data');
    expect(storedState).toBeTruthy();
    
    const stateData = JSON.parse(storedState!);
    expect(stateData.provider).toBe('github');
    expect(stateData.state).toBeTruthy();
  });

  it('should handle Google login initiation', async () => {
    const user = userEvent.setup();
    
    renderWithAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    await act(async () => {
      await user.click(screen.getByTestId('login-google'));
    });

    // Check if localStorage has the OAuth state
    const storedState = localStorage.getItem('oauth_state_data');
    expect(storedState).toBeTruthy();
    
    const stateData = JSON.parse(storedState!);
    expect(stateData.provider).toBe('google');
    expect(stateData.state).toBeTruthy();
  });

  it('should handle logout', async () => {
    const user = userEvent.setup();
    
    // Set up authenticated state
    const tokenData = {
      access_token: 'test-token',
      provider: 'github',
    };
    localStorage.setItem('auth_token_data', JSON.stringify(tokenData));
    localStorage.setItem('oauth_state_data', '{"state":"test","provider":"github"}');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 123,
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://avatars.githubusercontent.com/u/123',
        email: 'test@example.com'
      }),
    });

    await act(async () => {
      renderWithAuthProvider();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
    });

    await act(async () => {
      await user.click(screen.getByTestId('logout'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    // Check that localStorage is cleared
    expect(localStorage.getItem('auth_token_data')).toBeNull();
    expect(localStorage.getItem('oauth_state_data')).toBeNull();
  });

  it('should handle expired token', async () => {
    // Mock expired token data
    const tokenData = {
      access_token: 'expired-token',
      provider: 'github',
      expires_at: Date.now() - 1000, // Expired 1 second ago
      refresh_token: 'refresh-token',
    };
    localStorage.setItem('auth_token_data', JSON.stringify(tokenData));

    // Mock refresh token call
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await act(async () => {
      renderWithAuthProvider();
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    });

    // Should clear localStorage when refresh fails
    expect(localStorage.getItem('auth_token_data')).toBeNull();
  });

  it('should handle missing client ID error', async () => {
    const user = userEvent.setup();
    
    // Mock missing client ID
    const originalEnv = import.meta.env;
    vi.stubGlobal('import.meta', {
      env: {
        ...originalEnv,
        VITE_GITHUB_CLIENT_ID: '',
      },
    });

    renderWithAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    await act(async () => {
      await user.click(screen.getByTestId('login-github'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to start authentication process');
    });
  });
});