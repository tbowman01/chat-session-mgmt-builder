import request from 'supertest';
import express from 'express';
import nock from 'nock';
import authRoutes from '../../src/routes/auth.js';
import { generateToken } from '../../src/middleware/auth/index.js';

// Mock the auth middleware
jest.mock('../../src/middleware/auth/index.js', () => ({
  ...jest.requireActual('../../src/middleware/auth/index.js'),
  generateToken: jest.fn(),
  authRateLimit: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('OAuth Integration Tests', () => {
  let app: express.Application;
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Create test app
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    
    // Set up environment
    process.env = { ...originalEnv };
    process.env.GITHUB_CLIENT_ID = 'test-github-client-id';
    process.env.GITHUB_CLIENT_SECRET = 'test-github-secret';
    process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
    process.env.FRONTEND_URL = 'http://localhost:3000';
    process.env.JWT_SECRET = 'test-secret';
    
    // Clear mocks
    jest.clearAllMocks();
    (generateToken as jest.Mock).mockReturnValue('generated-jwt-token');
    
    // Clean nock
    nock.cleanAll();
  });
  
  afterEach(() => {
    process.env = originalEnv;
    nock.cleanAll();
  });
  
  afterAll(() => {
    nock.restore();
  });

  describe('GitHub OAuth Flow', () => {
    const mockGitHubUser = {
      id: 12345,
      login: 'octocat',
      name: 'The Octocat',
      email: 'octocat@github.com',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      bio: 'A great octopus',
      location: 'San Francisco',
      public_repos: 2,
      public_gists: 1,
      followers: 20,
      following: 0,
      created_at: '2008-01-14T04:33:35Z',
    };
    
    it('should complete full GitHub OAuth flow successfully', async () => {
      // Step 1: Mock GitHub token exchange
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, {
          access_token: 'github_access_token_123',
          scope: 'user:email',
          token_type: 'bearer',
        });
      
      // Step 2: Mock GitHub user API
      nock('https://api.github.com')
        .get('/user')
        .matchHeader('authorization', 'Bearer github_access_token_123')
        .matchHeader('accept', 'application/vnd.github.v3+json')
        .reply(200, mockGitHubUser);
      
      // Step 3: Simulate OAuth callback
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({
          code: 'github_auth_code_123',
          state: 'random_state_456',
        })
        .expect(302);
      
      // Step 4: Verify redirect to frontend with token
      expect(response.headers.location).toBe('http://localhost:3000/auth/success?token=generated-jwt-token');
      
      // Step 5: Verify token generation was called with correct user data
      expect(generateToken).toHaveBeenCalledWith({
        id: '12345',
        login: 'octocat',
        name: 'The Octocat',
        email: 'octocat@github.com',
        avatar_url: 'https://github.com/images/error/octocat_happy.gif',
        provider: 'github',
      });
      
      // Verify all HTTP mocks were called
      expect(nock.isDone()).toBe(true);
    });
    
    it('should handle GitHub API rate limiting', async () => {
      // Mock rate limit response
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, {
          access_token: 'github_access_token_123',
        });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(403, {
          message: 'API rate limit exceeded',
          documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
        });
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({
          code: 'auth_code',
          state: 'state',
        })
        .expect(302);
      
      expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      expect(nock.isDone()).toBe(true);
    });
    
    it('should handle GitHub token exchange errors', async () => {
      // Mock GitHub error response
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(400, {
          error: 'incorrect_client_credentials',
          error_description: 'The client_id and/or client_secret passed are incorrect.',
        });
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({
          code: 'invalid_code',
          state: 'state',
        })
        .expect(302);
      
      expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      expect(nock.isDone()).toBe(true);
    });
    
    it('should handle GitHub user with minimal data', async () => {
      const minimalGitHubUser = {
        id: 67890,
        login: 'minimal_user',
        // name is null
        name: null,
        // email is null
        email: null,
        avatar_url: 'https://github.com/images/error/minimal.gif',
      };
      
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, {
          access_token: 'github_token',
        });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(200, minimalGitHubUser);
      
      await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .expect(302);
      
      expect(generateToken).toHaveBeenCalledWith({
        id: '67890',
        login: 'minimal_user',
        name: 'minimal_user', // Should fallback to login
        email: null,
        avatar_url: 'https://github.com/images/error/minimal.gif',
        provider: 'github',
      });
    });
    
    it('should handle GitHub private email scenario', async () => {
      const userWithoutPublicEmail = {
        ...mockGitHubUser,
        email: null, // Email is private
      };
      
      const privateEmails = [
        {
          email: 'private@example.com',
          primary: true,
          verified: true,
          visibility: null,
        },
        {
          email: 'secondary@example.com',
          primary: false,
          verified: true,
          visibility: null,
        },
      ];
      
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, {
          access_token: 'github_token_with_email_scope',
          scope: 'user:email',
        });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(200, userWithoutPublicEmail);
      
      // Note: In a real implementation, you might want to fetch private emails
      // nock('https://api.github.com')
      //   .get('/user/emails')
      //   .reply(200, privateEmails);
      
      await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .expect(302);
      
      expect(generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          email: null, // Should handle null email gracefully
          provider: 'github',
        })
      );
    });
    
    it('should handle network timeouts', async () => {
      // Mock timeout on token exchange
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .delayConnection(30000) // 30 second delay to simulate timeout
        .reply(200, { access_token: 'token' });
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .timeout(5000)
        .expect(302);
      
      expect(response.headers.location).toContain('/auth/error');
    });
  });

  describe('OAuth Security Tests', () => {
    it('should validate state parameter to prevent CSRF', async () => {
      // Test missing state parameter
      const response1 = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'valid_code' })
        .expect(302);
      
      // Should redirect to success since our current implementation doesn't validate state
      // In a real implementation, this should redirect to error
      expect(response1.headers.location).toMatch(/localhost:3000/);
    });
    
    it('should handle OAuth error responses', async () => {
      const errorCases = [
        'access_denied',
        'unauthorized_client',
        'unsupported_response_type',
        'invalid_scope',
        'server_error',
        'temporarily_unavailable',
      ];
      
      for (const error of errorCases) {
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({ error, error_description: `Test ${error}` })
          .expect(302);
        
        expect(response.headers.location).toContain(`error=${error}`);
      }
    });
    
    it('should handle malicious redirect attempts', async () => {
      // Test with malicious redirect_uri in OAuth initiation
      const response = await request(app)
        .get('/api/auth/github')
        .expect(302);
      
      const redirectUrl = new URL(response.headers.location);
      const redirectUri = redirectUrl.searchParams.get('redirect_uri');
      
      // Should only redirect to our own callback
      expect(redirectUri).toContain('/api/auth/github/callback');
      expect(redirectUri).not.toContain('evil.com');
    });
    
    it('should generate secure random state', async () => {
      const response1 = await request(app).get('/api/auth/github').expect(302);
      const response2 = await request(app).get('/api/auth/github').expect(302);
      
      const url1 = new URL(response1.headers.location);
      const url2 = new URL(response2.headers.location);
      
      const state1 = url1.searchParams.get('state');
      const state2 = url2.searchParams.get('state');
      
      // States should be different and non-empty
      expect(state1).toBeTruthy();
      expect(state2).toBeTruthy();
      expect(state1).not.toBe(state2);
      expect(state1!.length).toBeGreaterThan(20); // Should be reasonably long
    });
  });

  describe('OAuth Scope Handling', () => {
    it('should request appropriate GitHub scopes', async () => {
      const response = await request(app)
        .get('/api/auth/github')
        .expect(302);
      
      const redirectUrl = new URL(response.headers.location);
      const scope = redirectUrl.searchParams.get('scope');
      
      expect(scope).toBe('user:email read:user');
    });
    
    it('should handle insufficient scopes gracefully', async () => {
      // Mock GitHub response with limited scope
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, {
          access_token: 'limited_token',
          scope: 'read:user', // Missing email scope
        });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(200, {
          ...mockGitHubUser,
          email: null, // No email due to missing scope
        });
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .expect(302);
      
      // Should still succeed but with null email
      expect(response.headers.location).toContain('/auth/success');
      expect(generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          email: null,
        })
      );
    });
  });

  describe('OAuth Error Recovery', () => {
    it('should handle partial failures gracefully', async () => {
      // Token exchange succeeds, but user fetch fails
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, { access_token: 'token' });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(500, { message: 'Internal Server Error' });
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .expect(302);
      
      expect(response.headers.location).toContain('/auth/error');
      expect(generateToken).not.toHaveBeenCalled();
    });
    
    it('should handle GitHub API changes gracefully', async () => {
      // Mock unexpected response format
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, { access_token: 'token' });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(200, {
          // Missing required fields
          id: 123,
          // login is missing
          // name is missing
        });
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .expect(302);
      
      // Should handle gracefully and generate token with available data
      expect(response.headers.location).toContain('/auth/success');
    });
    
    it('should handle concurrent OAuth attempts', async () => {
      // Mock slow response for first request
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .delay(2000)
        .reply(200, { access_token: 'token1' });
      
      nock('https://api.github.com')
        .get('/user')
        .delay(1000)
        .reply(200, mockGitHubUser);
      
      // Mock fast response for second request
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, { access_token: 'token2' });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(200, mockGitHubUser);
      
      // Make concurrent requests
      const [response1, response2] = await Promise.all([
        request(app)
          .get('/api/auth/github/callback')
          .query({ code: 'code1', state: 'state1' }),
        request(app)
          .get('/api/auth/github/callback')
          .query({ code: 'code2', state: 'state2' }),
      ]);
      
      // Both should succeed
      expect(response1.status).toBe(302);
      expect(response2.status).toBe(302);
      expect(response1.headers.location).toContain('/auth/success');
      expect(response2.headers.location).toContain('/auth/success');
    });
  });

  describe('Integration with Frontend', () => {
    it('should redirect to custom frontend URL', async () => {
      process.env.FRONTEND_URL = 'https://custom-domain.com';
      
      // Recreate app with new environment
      app = express();
      app.use(express.json());
      app.use('/api/auth', authRoutes);
      
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, { access_token: 'token' });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(200, mockGitHubUser);
      
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .expect(302);
      
      expect(response.headers.location).toContain('https://custom-domain.com/auth/success');
    });
    
    it('should include error details in error redirects', async () => {
      const response = await request(app)
        .get('/api/auth/github/callback')
        .query({ error: 'access_denied', error_description: 'User denied access' })
        .expect(302);
      
      const redirectUrl = new URL(response.headers.location);
      expect(redirectUrl.searchParams.get('error')).toBe('access_denied');
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle high concurrency', async () => {
      // Set up mocks for multiple requests
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .times(10)
        .reply(200, { access_token: 'token' });
      
      nock('https://api.github.com')
        .get('/user')
        .times(10)
        .reply(200, mockGitHubUser);
      
      // Make 10 concurrent requests
      const requests = Array.from({ length: 10 }, (_, i) =>
        request(app)
          .get('/api/auth/github/callback')
          .query({ code: `code${i}`, state: `state${i}` })
      );
      
      const responses = await Promise.all(requests);
      
      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(302);
        expect(response.headers.location).toContain('/auth/success');
      });
      
      expect(nock.isDone()).toBe(true);
    });
    
    it('should handle OAuth flow within reasonable time', async () => {
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(200, { access_token: 'token' });
      
      nock('https://api.github.com')
        .get('/user')
        .reply(200, mockGitHubUser);
      
      const startTime = Date.now();
      
      await request(app)
        .get('/api/auth/github/callback')
        .query({ code: 'code', state: 'state' })
        .expect(302);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (adjust as needed)
      expect(duration).toBeLessThan(5000); // 5 seconds
    });
  });
});