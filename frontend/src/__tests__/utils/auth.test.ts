import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getStoredTokenData,
  storeTokenData,
  clearAuthData,
  isTokenExpired,
  willTokenExpireSoon,
  generateOAuthState,
  validateOAuthState,
  buildOAuthUrl,
  getUserInfo,
  createAuthError,
  handleFetchError,
} from '../../utils/auth';

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn().mockReturnValue(new Uint8Array(16).fill(1)),
  },
});

describe('Auth Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Token storage', () => {
    it('should store and retrieve token data', () => {
      const tokenData = {
        access_token: 'test-token',
        provider: 'github' as const,
        expires_at: Date.now() + 3600000,
        refresh_token: 'refresh-token',
      };

      storeTokenData(tokenData);
      const retrieved = getStoredTokenData();

      expect(retrieved).toEqual(tokenData);
    });

    it('should return null for missing token data', () => {
      const retrieved = getStoredTokenData();
      expect(retrieved).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('auth_token_data', 'invalid-json');
      const retrieved = getStoredTokenData();
      expect(retrieved).toBeNull();
    });

    it('should clear all auth data', () => {
      localStorage.setItem('auth_token_data', 'test-token');
      localStorage.setItem('oauth_state_data', 'test-state');

      clearAuthData();

      expect(localStorage.getItem('auth_token_data')).toBeNull();
      expect(localStorage.getItem('oauth_state_data')).toBeNull();
    });
  });

  describe('Token expiration', () => {
    it('should detect expired token', () => {
      const expiredToken = {
        access_token: 'test-token',
        provider: 'github' as const,
        expires_at: Date.now() - 1000, // Expired 1 second ago
      };

      expect(isTokenExpired(expiredToken)).toBe(true);
    });

    it('should detect valid token', () => {
      const validToken = {
        access_token: 'test-token',
        provider: 'github' as const,
        expires_at: Date.now() + 3600000, // Expires in 1 hour
      };

      expect(isTokenExpired(validToken)).toBe(false);
    });

    it('should handle token without expiration', () => {
      const tokenWithoutExpiry = {
        access_token: 'test-token',
        provider: 'github' as const,
      };

      expect(isTokenExpired(tokenWithoutExpiry)).toBe(false);
    });

    it('should detect token that will expire soon', () => {
      const soonToExpireToken = {
        access_token: 'test-token',
        provider: 'github' as const,
        expires_at: Date.now() + (2 * 60 * 1000), // Expires in 2 minutes
      };

      expect(willTokenExpireSoon(soonToExpireToken, 5)).toBe(true);
    });

    it('should detect token that will not expire soon', () => {
      const notSoonToExpireToken = {
        access_token: 'test-token',
        provider: 'github' as const,
        expires_at: Date.now() + (10 * 60 * 1000), // Expires in 10 minutes
      };

      expect(willTokenExpireSoon(notSoonToExpireToken, 5)).toBe(false);
    });
  });

  describe('OAuth state management', () => {
    it('should generate random OAuth state', () => {
      const state1 = generateOAuthState();
      const state2 = generateOAuthState();

      expect(state1).toBeTruthy();
      expect(state2).toBeTruthy();
      expect(state1).toBe(state2); // Same because we mocked crypto
      expect(state1).toHaveLength(32); // 16 bytes * 2 hex chars each
    });

    it('should validate correct OAuth state', () => {
      const state = 'test-state';
      const provider = 'github';
      
      localStorage.setItem('oauth_state_data', JSON.stringify({ state, provider }));

      const result = validateOAuthState(state);
      expect(result.isValid).toBe(true);
      expect(result.provider).toBe(provider);
    });

    it('should invalidate incorrect OAuth state', () => {
      const state = 'test-state';
      localStorage.setItem('oauth_state_data', JSON.stringify({ state, provider: 'github' }));

      const result = validateOAuthState('wrong-state');
      expect(result.isValid).toBe(false);
    });

    it('should handle missing OAuth state', () => {
      const result = validateOAuthState('any-state');
      expect(result.isValid).toBe(false);
    });
  });

  describe('OAuth URL building', () => {
    beforeEach(() => {
      // Mock import.meta.env for these tests
      vi.doMock('../../utils/auth.ts', async () => {
        const actual = await vi.importActual('../../utils/auth.ts');
        return {
          ...actual,
        };
      });
    });

    afterEach(() => {
      vi.doUnmock('../../utils/auth.ts');
    });

    it('should build GitHub OAuth URL', () => {
      // Mock the environment variables directly in the function
      const originalEnv = import.meta.env;
      vi.stubGlobal('import.meta', {
        env: {
          ...originalEnv,
          VITE_GITHUB_CLIENT_ID: 'github-client-id',
          VITE_GITHUB_REDIRECT_URI: 'http://localhost:3000',
        },
      });

      const state = 'test-state';
      const url = buildOAuthUrl('github', state);

      expect(url).toBeTruthy();
      expect(url).toContain('https://github.com/login/oauth/authorize');
      expect(url).toContain('client_id=github-client-id');
      expect(url).toContain('state=test-state');
      expect(url).toContain('scope=user:email%20read:user');
      
      // Restore original env
      vi.stubGlobal('import.meta', { env: originalEnv });
    });

    it('should build Google OAuth URL', () => {
      // Mock the environment variables directly in the function
      const originalEnv = import.meta.env;
      vi.stubGlobal('import.meta', {
        env: {
          ...originalEnv,
          VITE_GOOGLE_CLIENT_ID: 'google-client-id',
          VITE_GITHUB_REDIRECT_URI: 'http://localhost:3000',
        },
      });

      const state = 'test-state';
      const url = buildOAuthUrl('google', state);

      expect(url).toBeTruthy();
      expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(url).toContain('client_id=google-client-id');
      expect(url).toContain('state=test-state');
      expect(url).toContain('scope=openid%20email%20profile');
      
      // Restore original env
      vi.stubGlobal('import.meta', { env: originalEnv });
    });

    it('should return null for missing GitHub client ID', () => {
      const originalEnv = import.meta.env;
      vi.stubGlobal('import.meta', {
        env: {
          ...originalEnv,
          VITE_GITHUB_CLIENT_ID: '',
          VITE_GITHUB_REDIRECT_URI: 'http://localhost:3000',
        },
      });

      const url = buildOAuthUrl('github', 'test-state');
      expect(url).toBeNull();
      
      // Restore original env
      vi.stubGlobal('import.meta', { env: originalEnv });
    });

    it('should return null for missing Google client ID', () => {
      const originalEnv = import.meta.env;
      vi.stubGlobal('import.meta', {
        env: {
          ...originalEnv,
          VITE_GOOGLE_CLIENT_ID: '',
          VITE_GITHUB_REDIRECT_URI: 'http://localhost:3000',
        },
      });

      const url = buildOAuthUrl('google', 'test-state');
      expect(url).toBeNull();
      
      // Restore original env
      vi.stubGlobal('import.meta', { env: originalEnv });
    });
  });

  describe('User info retrieval', () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    beforeEach(() => {
      mockFetch.mockClear();
    });

    it('should get GitHub user info', async () => {
      const mockGitHubData = {
        id: 123,
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://avatars.githubusercontent.com/u/123',
        email: 'test@example.com',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubData,
      });

      const tokenData = {
        access_token: 'github-token',
        provider: 'github' as const,
      };

      const userInfo = await getUserInfo(tokenData);

      expect(userInfo).toEqual({
        id: '123',
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://avatars.githubusercontent.com/u/123',
        email: 'test@example.com',
        provider: 'github',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/user', {
        headers: {
          Authorization: 'Bearer github-token',
          Accept: 'application/vnd.github.v3+json',
        },
      });
    });

    it('should get Google user info', async () => {
      const mockGoogleData = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        picture: 'https://lh3.googleusercontent.com/a/test',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGoogleData,
      });

      const tokenData = {
        access_token: 'google-token',
        provider: 'google' as const,
      };

      const userInfo = await getUserInfo(tokenData);

      expect(userInfo).toEqual({
        id: '123',
        login: 'test@example.com',
        name: 'Test User',
        avatar_url: 'https://lh3.googleusercontent.com/a/test',
        email: 'test@example.com',
        provider: 'google',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: 'Bearer google-token',
        },
      });
    });

    it('should throw error for API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const tokenData = {
        access_token: 'invalid-token',
        provider: 'github' as const,
      };

      await expect(getUserInfo(tokenData)).rejects.toThrow('GitHub API error: 401');
    });

    it('should throw error for unsupported provider', async () => {
      const tokenData = {
        access_token: 'test-token',
        provider: 'unsupported' as any,
      };

      await expect(getUserInfo(tokenData)).rejects.toThrow('Unsupported provider: unsupported');
    });
  });

  describe('Error handling', () => {
    it('should create auth error', () => {
      const error = createAuthError('TEST_CODE', 'Test message', 'Test details');

      expect(error).toEqual({
        code: 'TEST_CODE',
        message: 'Test message',
        details: 'Test details',
      });
    });

    it('should handle fetch errors', () => {
      const networkError = new Error('Network failure');
      const authError = handleFetchError(networkError, 'Failed to fetch');

      expect(authError).toEqual({
        code: 'FETCH_ERROR',
        message: 'Failed to fetch',
        details: 'Network failure',
      });
    });

    it('should handle unknown errors', () => {
      const unknownError = 'Unknown error string';
      const authError = handleFetchError(unknownError, 'Failed to fetch');

      expect(authError).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch',
        details: 'An unknown error occurred',
      });
    });
  });
});