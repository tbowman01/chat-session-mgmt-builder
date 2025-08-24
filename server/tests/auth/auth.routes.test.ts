import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth.js';
import { generateToken } from '../../src/middleware/auth/index.js';

// Mock external dependencies
jest.mock('../../src/middleware/auth/index.js', () => ({
  ...jest.requireActual('../../src/middleware/auth/index.js'),
  generateToken: jest.fn(),
  authenticateToken: jest.fn((req, res, next) => {
    // Mock authenticated user for protected routes
    if (req.headers.authorization === 'Bearer valid-token') {
      req.user = {
        id: '1',
        login: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'github',
      };
      next();
    } else if (req.headers.authorization === 'Bearer invalid-token') {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid authentication token',
      });
    } else {
      res.status(401).json({
        error: 'Access denied',
        message: 'Authentication token required',
      });
    }
  }),
}));

// Mock fetch globally
global.fetch = jest.fn();
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  return app;
};

describe('Auth Routes', () => {
  let app: express.Application;
  const originalEnv = process.env;
  
  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
    
    // Set up environment
    process.env = { ...originalEnv };
    process.env.GITHUB_CLIENT_ID = 'test-github-client-id';
    process.env.GITHUB_CLIENT_SECRET = 'test-github-secret';
    process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
    process.env.FRONTEND_URL = 'http://localhost:3000';
    process.env.JWT_SECRET = 'test-secret';
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GET /api/auth/github', () => {
    it('should redirect to GitHub OAuth authorization URL', async () => {
      const response = await request(app)
        .get('/api/auth/github')
        .expect(302);
      
      expect(response.headers.location).toContain('https://github.com/login/oauth/authorize');
      expect(response.headers.location).toContain('client_id=test-github-client-id');
      expect(response.headers.location).toContain('scope=user%3Aemail%20read%3Auser');
      expect(response.headers.location).toContain('state=');
    });
    
    it('should return error if GitHub client ID not configured', async () => {
      delete process.env.GITHUB_CLIENT_ID;
      
      const response = await request(app)
        .get('/api/auth/github')
        .expect(500);
      
      expect(response.body).toEqual({
        error: 'GitHub OAuth not configured',
        message: 'GitHub client ID not found in environment variables',
      });
    });
    
    it('should include correct redirect URI', async () => {
      const response = await request(app)
        .get('/api/auth/github')
        .expect(302);
      
      const redirectUrl = new URL(response.headers.location);
      const redirectUri = redirectUrl.searchParams.get('redirect_uri');
      expect(redirectUri).toContain('/api/auth/github/callback');
    });
  });

  describe('GET /api/auth/github/callback', () => {
    const mockGitHubUser = {
      id: 12345,
      login: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://github.com/avatar.jpg',
    };
    
    beforeEach(() => {
      (generateToken as jest.Mock).mockReturnValue('generated-jwt-token');
    });
    
    it('should handle successful OAuth callback', async () => {
      // Mock token exchange
      mockedFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access_token: 'github-access-token' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGitHubUser),
        } as Response);
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'auth-code', state: 'csrf-state' })
        .expect(302);
      
      expect(response.headers.location).toContain('http://localhost:3000/auth/success');
      expect(response.headers.location).toContain('token=generated-jwt-token');
      
      // Verify API calls
      expect(mockedFetch).toHaveBeenCalledTimes(2);
      expect(mockedFetch).toHaveBeenNthCalledWith(1, 'https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 'test-github-client-id',
          client_secret: 'test-github-secret',
          code: 'auth-code',
        }),
      });
      
      expect(mockedFetch).toHaveBeenNthCalledWith(2, 'https://api.github.com/user', {
        headers: {
          Authorization: 'Bearer github-access-token',
          Accept: 'application/vnd.github.v3+json',
        },
      });
      
      // Verify token generation
      expect(generateToken).toHaveBeenCalledWith({
        id: '12345',
        login: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://github.com/avatar.jpg',
        provider: 'github',
      });
    });
    
    it('should handle OAuth error parameter', async () => {
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ error: 'access_denied' })
        .expect(302);
      
      expect(response.headers.location).toBe('http://localhost:3000/auth/error?error=access_denied');
    });
    
    it('should handle missing code parameter', async () => {
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ state: 'csrf-state' })
        .expect(302);
      
      expect(response.headers.location).toBe('http://localhost:3000/auth/error?error=missing_code');
    });
    
    it('should handle token exchange failure', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ error: 'invalid_grant' }),
      } as Response);
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'invalid-code', state: 'csrf-state' })
        .expect(302);
      
      expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      expect(response.headers.location).toContain('error=');
    });
    
    it('should handle GitHub API failure', async () => {
      mockedFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access_token: 'github-access-token' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        } as Response);
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'auth-code', state: 'csrf-state' })
        .expect(302);
      
      expect(response.headers.location).toContain('http://localhost:3000/auth/error');
    });
    
    it('should handle user without name gracefully', async () => {
      const userWithoutName = { ...mockGitHubUser, name: null };
      
      mockedFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access_token: 'github-access-token' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(userWithoutName),
        } as Response);
      
      await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'auth-code', state: 'csrf-state' })
        .expect(302);
      
      expect(generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'testuser', // Should fallback to login
        })
      );
    });
    
    it('should handle network errors', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Network error'));
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'auth-code', state: 'csrf-state' })
        .expect(302);
      
      expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      expect(response.headers.location).toContain('error=Network%20error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(() => {
      (generateToken as jest.Mock).mockReturnValue('generated-jwt-token');
    });
    
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
        })
        .expect(200);
      
      expect(response.body).toEqual({
        success: true,
        token: 'generated-jwt-token',
        user: {
          id: '1',
          login: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          provider: 'credentials',
        },
      });
      
      expect(generateToken).toHaveBeenCalledWith({
        id: '1',
        login: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'credentials',
      });
    });
    
    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
      
      expect(response.body).toEqual({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    });
    
    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'TestPassword123!',
        })
        .expect(400);
      
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'email',
            msg: expect.any(String),
          }),
        ])
      );
    });
    
    it('should validate password length', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: '123',
        })
        .expect(400);
      
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'password',
            msg: expect.any(String),
          }),
        ])
      );
    });
    
    it('should handle missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'TestPassword123!',
        })
        .expect(400);
      
      expect(response.body.error).toBe('Validation failed');
    });
    
    it('should handle missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
      
      expect(response.body.error).toBe('Validation failed');
    });
    
    it('should handle token generation error', async () => {
      (generateToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token generation failed');
      });
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
        })
        .expect(500);
      
      expect(response.body).toEqual({
        error: 'Login failed',
        message: 'An error occurred during authentication',
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout authenticated user', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });
    
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);
      
      expect(response.body).toEqual({
        error: 'Access denied',
        message: 'Authentication token required',
      });
    });
    
    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
      
      expect(response.body).toEqual({
        error: 'Authentication failed',
        message: 'Invalid authentication token',
      });
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile for authenticated user', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toEqual({
        success: true,
        user: {
          id: '1',
          login: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          provider: 'github',
        },
      });
    });
    
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);
      
      expect(response.body).toEqual({
        error: 'Access denied',
        message: 'Authentication token required',
      });
    });
  });

  describe('POST /api/auth/verify', () => {
    it('should verify valid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toEqual({
        valid: true,
        user: {
          id: '1',
          login: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          provider: 'github',
        },
      });
    });
    
    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
      
      expect(response.body).toEqual({
        error: 'Authentication failed',
        message: 'Invalid authentication token',
      });
    });
  });

  describe('GET /api/auth/refresh', () => {
    beforeEach(() => {
      (generateToken as jest.Mock).mockReturnValue('new-jwt-token');
    });
    
    it('should refresh token for authenticated user', async () => {
      const response = await request(app)
        .get('/api/auth/refresh')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toEqual({
        success: true,
        token: 'new-jwt-token',
        user: {
          id: '1',
          login: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          provider: 'github',
        },
      });
      
      expect(generateToken).toHaveBeenCalledWith({
        id: '1',
        login: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'github',
      });
    });
    
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/auth/refresh')
        .expect(401);
      
      expect(response.body).toEqual({
        error: 'Access denied',
        message: 'Authentication token required',
      });
    });
    
    it('should handle token generation error', async () => {
      (generateToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token generation failed');
      });
      
      const response = await request(app)
        .get('/api/auth/refresh')
        .set('Authorization', 'Bearer valid-token')
        .expect(500);
      
      expect(response.body).toEqual({
        error: 'Token refresh failed',
        message: 'Failed to generate new token',
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to login endpoint', async () => {
      // Make multiple requests quickly
      const requests = Array.from({ length: 6 }, () =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
      );
      
      const responses = await Promise.all(requests);
      
      // Should have some 429 responses due to rate limiting
      const tooManyRequests = responses.filter(res => res.status === 429);
      expect(tooManyRequests.length).toBeGreaterThan(0);
      
      const rateLimitResponse = tooManyRequests[0];
      expect(rateLimitResponse.body.error).toBe('Too many authentication attempts');
      expect(rateLimitResponse.body.retryAfter).toBeDefined();
    });
    
    it('should apply rate limiting to GitHub callback', async () => {
      // Make multiple requests to trigger rate limiting
      const requests = Array.from({ length: 12 }, () =>
        request(app)
          .get('/api/auth/github/callback')
          .query({ error: 'access_denied' })
      );
      
      const responses = await Promise.all(requests);
      
      // Should have some 429 responses
      const tooManyRequests = responses.filter(res => res.status === 429);
      expect(tooManyRequests.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON in login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .type('json')
        .send('{"invalid": json}')
        .expect(400);
    });
    
    it('should handle missing environment variables gracefully', async () => {
      delete process.env.GITHUB_CLIENT_SECRET;
      
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'token' }),
      } as Response);
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .expect(302);
      
      expect(response.headers.location).toContain('/auth/error');
    });
  });
});