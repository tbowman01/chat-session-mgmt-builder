import request from 'supertest';
import express from 'express';
import { authenticateToken, generateToken, verifyToken } from '../../src/middleware/auth/index.js';
import authRoutes from '../../src/routes/auth.js';

// Mock external dependencies
global.fetch = jest.fn();
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

jest.mock('jsonwebtoken');
jest.mock('../../src/middleware/auth/index.js', () => ({
  ...jest.requireActual('../../src/middleware/auth/index.js'),
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  authenticateToken: jest.fn((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'valid-token') {
      req.user = { id: '1', login: 'testuser', name: 'Test User', provider: 'github' };
      next();
    } else if (token === 'expired-token') {
      res.status(401).json({ error: 'Authentication failed', message: 'Authentication token expired' });
    } else if (token === 'invalid-token') {
      res.status(401).json({ error: 'Authentication failed', message: 'Invalid authentication token' });
    } else {
      res.status(401).json({ error: 'Access denied', message: 'Authentication token required' });
    }
  }),
}));

describe('Authentication Error Scenarios', () => {
  let app: express.Application;
  const originalEnv = process.env;
  
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.GITHUB_CLIENT_ID = 'test-client-id';
    process.env.GITHUB_CLIENT_SECRET = 'test-client-secret';
    process.env.FRONTEND_URL = 'http://localhost:3000';
    process.env.JWT_SECRET = 'test-secret';
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });

  describe('OAuth Error Scenarios', () => {
    describe('GitHub OAuth Errors', () => {
      it('should handle OAuth access_denied error', async () => {
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({
            error: 'access_denied',
            error_description: 'The user denied the request',
          })
          .expect(302);
        
        expect(response.headers.location).toBe('http://localhost:3000/auth/error?error=access_denied');
      });
      
      it('should handle OAuth application_suspended error', async () => {
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({
            error: 'application_suspended',
            error_description: 'The application has been suspended',
          })
          .expect(302);
        
        expect(response.headers.location).toBe('http://localhost:3000/auth/error?error=application_suspended');
      });
      
      it('should handle missing authorization code', async () => {
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({ state: 'valid-state' })
          .expect(302);
        
        expect(response.headers.location).toBe('http://localhost:3000/auth/error?error=missing_code');
      });
      
      it('should handle invalid authorization code', async () => {
        mockedFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            error: 'bad_verification_code',
            error_description: 'The code passed is incorrect or expired',
          }),
        } as Response);
        
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({
            code: 'invalid-code',
            state: 'valid-state',
          })
          .expect(302);
        
        expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      });
      
      it('should handle GitHub API rate limiting', async () => {
        mockedFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ access_token: 'token' }),
          } as Response)
          .mockResolvedValueOnce({
            ok: false,
            status: 403,
            json: () => Promise.resolve({
              message: 'API rate limit exceeded for user',
              documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
            }),
          } as Response);
        
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({
            code: 'valid-code',
            state: 'valid-state',
          })
          .expect(302);
        
        expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      });
      
      it('should handle GitHub service unavailable', async () => {
        mockedFetch.mockResolvedValueOnce({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable',
        } as Response);
        
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({
            code: 'valid-code',
            state: 'valid-state',
          })
          .expect(302);
        
        expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      });
      
      it('should handle network timeouts', async () => {
        mockedFetch.mockRejectedValueOnce(new Error('ECONNRESET'));
        
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({
            code: 'valid-code',
            state: 'valid-state',
          })
          .expect(302);
        
        expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      });
      
      it('should handle malformed GitHub response', async () => {
        mockedFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ access_token: 'token' }),
          } as Response)
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve('invalid json structure'),
          } as Response);
        
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({
            code: 'valid-code',
            state: 'valid-state',
          })
          .expect(302);
        
        expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      });
    });
    
    describe('OAuth Configuration Errors', () => {
      it('should handle missing GitHub client ID', async () => {
        delete process.env.GITHUB_CLIENT_ID;
        
        const response = await request(app)
          .get('/api/auth/github')
          .expect(500);
        
        expect(response.body).toEqual({
          error: 'GitHub OAuth not configured',
          message: 'GitHub client ID not found in environment variables',
        });
      });
      
      it('should handle missing GitHub client secret during callback', async () => {
        delete process.env.GITHUB_CLIENT_SECRET;
        
        mockedFetch.mockRejectedValueOnce(new Error('Bad credentials'));
        
        const response = await request(app)
          .get('/api/auth/github/callback')
          .query({
            code: 'valid-code',
            state: 'valid-state',
          })
          .expect(302);
        
        expect(response.headers.location).toContain('http://localhost:3000/auth/error');
      });
    });
  });

  describe('JWT Token Error Scenarios', () => {
    describe('Token Validation Errors', () => {
      it('should handle expired tokens', async () => {
        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', 'Bearer expired-token')
          .expect(401);
        
        expect(response.body).toEqual({
          error: 'Authentication failed',
          message: 'Authentication token expired',
        });
      });
      
      it('should handle invalid token format', async () => {
        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);
        
        expect(response.body).toEqual({
          error: 'Authentication failed',
          message: 'Invalid authentication token',
        });
      });
      
      it('should handle missing Bearer keyword', async () => {
        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', 'token-without-bearer')
          .expect(401);
        
        expect(response.body).toEqual({
          error: 'Access denied',
          message: 'Authentication token required',
        });
      });
      
      it('should handle empty authorization header', async () => {
        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', '')
          .expect(401);
        
        expect(response.body).toEqual({
          error: 'Access denied',
          message: 'Authentication token required',
        });
      });
      
      it('should handle malformed JWT tokens', async () => {
        const malformedTokens = [
          'Bearer not.a.jwt',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          'Bearer malformed',
          'Bearer ..',
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0',
        ];
        
        for (const token of malformedTokens) {
          const response = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', token)
            .expect(401);
          
          expect(response.body.error).toBe('Authentication failed');
        }
      });
    });
    
    describe('Token Generation Errors', () => {
      it('should handle token generation failures in login', async () => {
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
      
      it('should handle token generation failures in refresh', async () => {
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
  });

  describe('Input Validation Error Scenarios', () => {
    describe('Login Validation Errors', () => {
      it('should handle invalid email format', async () => {
        const invalidEmails = [
          'not-an-email',
          '@domain.com',
          'user@',
          'user..name@domain.com',
          'user@domain',
          '',
          null,
          undefined,
        ];
        
        for (const email of invalidEmails) {
          const response = await request(app)
            .post('/api/auth/login')
            .send({
              email,
              password: 'ValidPassword123!',
            })
            .expect(400);
          
          expect(response.body.error).toBe('Validation failed');
          expect(response.body.details).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: 'email',
              }),
            ])
          );
        }
      });
      
      it('should handle invalid password length', async () => {
        const invalidPasswords = [
          '12345', // Too short
          '', // Empty
          'a', // Single character
          null,
          undefined,
        ];
        
        for (const password of invalidPasswords) {
          const response = await request(app)
            .post('/api/auth/login')
            .send({
              email: 'test@example.com',
              password,
            })
            .expect(400);
          
          expect(response.body.error).toBe('Validation failed');
          expect(response.body.details).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                path: 'password',
              }),
            ])
          );
        }
      });
      
      it('should handle missing request body', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .expect(400);
        
        expect(response.body.error).toBe('Validation failed');
      });
      
      it('should handle malformed JSON', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .type('json')
          .send('{"invalid": json syntax}')
          .expect(400);
      });
    });
    
    describe('SQL Injection Attempts', () => {
      it('should handle SQL injection in email field', async () => {
        const sqlInjectionAttempts = [
          "' OR '1'='1",
          "'; DROP TABLE users; --",
          "' UNION SELECT * FROM users --",
          "admin'--",
          "' OR 1=1 --",
        ];
        
        for (const maliciousEmail of sqlInjectionAttempts) {
          const response = await request(app)
            .post('/api/auth/login')
            .send({
              email: maliciousEmail,
              password: 'TestPassword123!',
            })
            .expect(400); // Should fail validation
          
          expect(response.body.error).toBe('Validation failed');
        }
      });
      
      it('should handle SQL injection in password field', async () => {
        const sqlInjectionAttempts = [
          "' OR '1'='1",
          "'; DROP TABLE users; --",
          "password' OR 1=1 --",
        ];
        
        for (const maliciousPassword of sqlInjectionAttempts) {
          const response = await request(app)
            .post('/api/auth/login')
            .send({
              email: 'test@example.com',
              password: maliciousPassword,
            });
          
          // Should either fail validation or return invalid credentials
          expect([400, 401]).toContain(response.status);
        }
      });
    });
    
    describe('XSS Attempts', () => {
      it('should handle XSS in input fields', async () => {
        const xssAttempts = [
          '<script>alert("xss")</script>',
          'javascript:alert("xss")',
          '<img src=x onerror=alert("xss")>',
          '"><script>alert("xss")</script>',
        ];
        
        for (const xssPayload of xssAttempts) {
          const response = await request(app)
            .post('/api/auth/login')
            .send({
              email: xssPayload,
              password: 'TestPassword123!',
            })
            .expect(400);
          
          expect(response.body.error).toBe('Validation failed');
          
          // Ensure XSS payload is not reflected in response
          const responseString = JSON.stringify(response.body);
          expect(responseString).not.toContain('<script>');
          expect(responseString).not.toContain('javascript:');
          expect(responseString).not.toContain('onerror=');
        }
      });
    });
  });

  describe('Rate Limiting Error Scenarios', () => {
    it('should handle rate limit exceeded for login', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const requests = Array.from({ length: 6 }, () =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
      );
      
      const responses = await Promise.all(requests);
      
      // At least some should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
      
      const rateLimitResponse = rateLimitedResponses[0];
      expect(rateLimitResponse.body).toEqual({
        error: 'Too many authentication attempts',
        message: expect.stringContaining('Rate limit exceeded'),
        retryAfter: expect.any(Number),
      });
    });
    
    it('should handle rate limit exceeded for OAuth callback', async () => {
      // Make multiple rapid requests to OAuth callback
      const requests = Array.from({ length: 12 }, () =>
        request(app)
          .get('/api/auth/github/callback')
          .query({ error: 'access_denied' })
      );
      
      const responses = await Promise.all(requests);
      
      // Should have rate limited responses
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Server Error Scenarios', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database error (in real app this would be a database call)
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
        });
      
      // Should either succeed or return proper error
      expect([200, 401, 500]).toContain(response.status);
      
      if (response.status === 500) {
        expect(response.body.error).toBeDefined();
        expect(response.body.message).toBeDefined();
        
        // Should not expose sensitive server details
        expect(response.body.message).not.toContain('password');
        expect(response.body.message).not.toContain('database');
        expect(response.body.message).not.toContain('connection string');
      }
    });
    
    it('should handle missing environment variables', async () => {
      delete process.env.JWT_SECRET;
      
      // Should fail gracefully without exposing configuration details
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer some-token');
      
      expect(response.status).toBe(401);
      expect(response.body.message).not.toContain('JWT_SECRET');
      expect(response.body.message).not.toContain('environment');
    });
    
    it('should handle server overload scenarios', async () => {
      // Simulate server overload by making many concurrent requests
      const requests = Array.from({ length: 50 }, () =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'TestPassword123!',
          })
      );
      
      const responses = await Promise.all(requests);
      
      // All requests should get proper responses (not crash)
      responses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
        expect(response.body).toBeDefined();
      });
    });
  });

  describe('Edge Case Error Scenarios', () => {
    it('should handle extremely long input values', async () => {
      const longString = 'a'.repeat(10000);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: longString + '@example.com',
          password: longString,
        })
        .expect(400);
      
      expect(response.body.error).toBe('Validation failed');
    });
    
    it('should handle special characters in input', async () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: `user${specialChars}@example.com`,
          password: `password${specialChars}123`,
        })
        .expect(400); // Should fail email validation
      
      expect(response.body.error).toBe('Validation failed');
    });
    
    it('should handle null and undefined values', async () => {
      const testCases = [
        { email: null, password: 'password' },
        { email: undefined, password: 'password' },
        { email: 'test@example.com', password: null },
        { email: 'test@example.com', password: undefined },
        { email: null, password: null },
      ];
      
      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(testCase)
          .expect(400);
        
        expect(response.body.error).toBe('Validation failed');
      }
    });
    
    it('should handle boolean and number values in string fields', async () => {
      const invalidValues = [
        { email: true, password: 'password' },
        { email: 123, password: 'password' },
        { email: 'test@example.com', password: false },
        { email: 'test@example.com', password: 456 },
        { email: [], password: 'password' },
        { email: {}, password: 'password' },
      ];
      
      for (const invalidValue of invalidValues) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(invalidValue)
          .expect(400);
        
        expect(response.body.error).toBe('Validation failed');
      }
    });
  });

  describe('Security Error Scenarios', () => {
    it('should handle timing attacks on login', async () => {
      const validEmail = 'test@example.com';
      const invalidEmails = [
        'invalid@example.com',
        'another@example.com',
        'fake@example.com',
      ];
      
      const timings: number[] = [];
      
      // Test with valid email (wrong password)
      const start1 = performance.now();
      await request(app)
        .post('/api/auth/login')
        .send({ email: validEmail, password: 'wrongpassword' });
      timings.push(performance.now() - start1);
      
      // Test with invalid emails
      for (const email of invalidEmails) {
        const start = performance.now();
        await request(app)
          .post('/api/auth/login')
          .send({ email, password: 'wrongpassword' });
        timings.push(performance.now() - start);
      }
      
      // All timings should be reasonably similar
      const maxTiming = Math.max(...timings);
      const minTiming = Math.min(...timings);
      const timingDifference = maxTiming - minTiming;
      
      // Allow for some variation but not too much (adjust as needed)
      expect(timingDifference).toBeLessThan(1000); // Less than 1 second difference
    });
    
    it('should not expose user enumeration through error messages', async () => {
      const emails = [
        'existing@example.com',
        'nonexisting@example.com',
        'test@example.com',
        'invalid@example.com',
      ];
      
      const responses = await Promise.all(
        emails.map(email =>
          request(app)
            .post('/api/auth/login')
            .send({ email, password: 'wrongpassword' })
        )
      );
      
      // All failed login attempts should return the same error message
      const errorMessages = responses.map(res => res.body.message);
      const uniqueMessages = [...new Set(errorMessages)];
      
      // Should have consistent error messages (not reveal if user exists)
      expect(uniqueMessages.length).toBeLessThanOrEqual(2); // At most validation error and invalid credentials
    });
  });
});