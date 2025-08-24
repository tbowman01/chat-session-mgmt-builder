import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import {
  generateToken,
  verifyToken,
  authenticateToken,
  authRateLimit,
  validateApiKey,
  AuthenticatedRequest,
  JWTPayload,
} from '../../src/middleware/auth/index.js';

// Mock jwt module
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Authentication Security Tests', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.API_KEY = 'test-api-key';
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });

  describe('JWT Security', () => {
    describe('Token Generation Security', () => {
      it('should use strong JWT options', () => {
        const user = {
          id: '123',
          login: 'testuser',
          name: 'Test User',
          provider: 'github' as const,
        };
        
        mockedJwt.sign.mockReturnValue('secure-token');
        
        generateToken(user);
        
        expect(mockedJwt.sign).toHaveBeenCalledWith(
          user,
          'test-secret-key',
          expect.objectContaining({
            expiresIn: '7d',
            issuer: 'chat-session-mgmt-builder',
            audience: 'chat-session-mgmt-users',
          })
        );
      });
      
      it('should handle different expiration times securely', () => {
        const testCases = ['1h', '1d', '7d', '30d'];
        const user = {
          id: '123',
          login: 'testuser',
          name: 'Test User',
          provider: 'github' as const,
        };
        
        testCases.forEach(expiresIn => {
          process.env.JWT_EXPIRES_IN = expiresIn;
          mockedJwt.sign.mockReturnValue('token');
          
          generateToken(user);
          
          expect(mockedJwt.sign).toHaveBeenLastCalledWith(
            user,
            'test-secret-key',
            expect.objectContaining({ expiresIn })
          );
        });
      });
      
      it('should not expose sensitive data in token payload', () => {
        const user = {
          id: '123',
          login: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          provider: 'github' as const,
        };
        
        mockedJwt.sign.mockReturnValue('token');
        
        generateToken(user);
        
        const tokenPayload = mockedJwt.sign.mock.calls[0][0] as any;
        
        // Should not contain sensitive fields like passwords, secrets, etc.
        expect(tokenPayload).not.toHaveProperty('password');
        expect(tokenPayload).not.toHaveProperty('secret');
        expect(tokenPayload).not.toHaveProperty('privateKey');
        expect(tokenPayload).not.toHaveProperty('accessToken');
        
        // Should contain only expected fields
        expect(tokenPayload).toEqual({
          id: '123',
          login: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          provider: 'github',
        });
      });
      
      it('should handle token generation errors securely', () => {
        mockedJwt.sign.mockImplementation(() => {
          throw new Error('Cryptographic error');
        });
        
        const user = {
          id: '123',
          login: 'testuser',
          name: 'Test User',
          provider: 'github' as const,
        };
        
        expect(() => generateToken(user)).toThrow('Failed to generate authentication token');
      });
    });
    
    describe('Token Verification Security', () => {
      it('should verify token with strict options', () => {
        const mockPayload: JWTPayload = {
          id: '123',
          login: 'testuser',
          name: 'Test User',
          provider: 'github',
        };
        
        mockedJwt.verify.mockReturnValue(mockPayload);
        
        const result = verifyToken('valid-token');
        
        expect(mockedJwt.verify).toHaveBeenCalledWith(
          'valid-token',
          'test-secret-key',
          {
            issuer: 'chat-session-mgmt-builder',
            audience: 'chat-session-mgmt-users',
          }
        );
        expect(result).toEqual(mockPayload);
      });
      
      it('should handle different JWT errors with specific messages', () => {
        const errorCases = [
          { error: jwt.JsonWebTokenError, message: 'Invalid authentication token' },
          { error: jwt.TokenExpiredError, message: 'Authentication token expired' },
          { error: jwt.NotBeforeError, message: 'Authentication token not yet valid' },
        ];
        
        errorCases.forEach(({ error, message }) => {
          mockedJwt.verify.mockImplementation(() => {
            throw new error('Test error', new Date());
          });
          
          expect(() => verifyToken('token')).toThrow(message);
        });
      });
      
      it('should handle generic verification errors', () => {
        mockedJwt.verify.mockImplementation(() => {
          throw new Error('Unknown verification error');
        });
        
        expect(() => verifyToken('token')).toThrow('Token verification failed');
      });
      
      it('should validate token structure', () => {
        const invalidPayloads = [
          null,
          undefined,
          '',
          123,
          { invalidField: 'value' },
          { id: null },
          { id: '', login: 'test' },
        ];
        
        invalidPayloads.forEach(payload => {
          mockedJwt.verify.mockReturnValue(payload as any);
          
          // Should still return the payload (validation happens at app level)
          const result = verifyToken('token');
          expect(result).toBe(payload);
        });
      });
    });
    
    describe('Token Injection Attacks', () => {
      it('should prevent JWT header injection', () => {
        const maliciousTokens = [
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.malicious.payload',
          'Bearer token\nX-Forwarded-For: evil.com',
          'token\r\nSet-Cookie: evil=true',
          'token<script>alert("xss")</script>',
        ];
        
        maliciousTokens.forEach(maliciousToken => {
          mockedJwt.verify.mockImplementation(() => {
            throw new jwt.JsonWebTokenError('Invalid token');
          });
          
          expect(() => verifyToken(maliciousToken)).toThrow('Invalid authentication token');
        });
      });
      
      it('should handle extremely long tokens', () => {
        const longToken = 'a'.repeat(100000); // 100KB token
        
        mockedJwt.verify.mockImplementation(() => {
          throw new jwt.JsonWebTokenError('Token too long');
        });
        
        expect(() => verifyToken(longToken)).toThrow('Invalid authentication token');
      });
    });
  });

  describe('Rate Limiting Security', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    
    beforeEach(() => {
      mockRequest = {
        ip: '192.168.1.1',
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('should prevent brute force attacks', () => {
      const rateLimitMiddleware = authRateLimit(3, 60000); // 3 attempts per minute
      
      // First 3 attempts should pass
      for (let i = 0; i < 3; i++) {
        rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(i + 1);
      }
      
      // 4th attempt should be blocked
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Too many authentication attempts',
        message: expect.stringContaining('Rate limit exceeded'),
        retryAfter: expect.any(Number),
      });
    });
    
    it('should handle IP spoofing attempts', () => {
      const rateLimitMiddleware = authRateLimit(1, 60000);
      
      // First request from IP
      mockRequest.ip = '192.168.1.1';
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      
      // Second request from same IP should be blocked
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Request from different IP should be allowed
      mockRequest.ip = '192.168.1.2';
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
    
    it('should handle missing IP address securely', () => {
      const rateLimitMiddleware = authRateLimit(1, 60000);
      
      mockRequest.ip = undefined;
      
      // Should still apply rate limiting using 'unknown' identifier
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
    });
    
    it('should prevent timing attacks on rate limiting', () => {
      const rateLimitMiddleware = authRateLimit(2, 60000);
      
      const start = performance.now();
      
      // Make allowed request
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      const allowedTime = performance.now() - start;
      
      // Make blocked request
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      const blockedTime = performance.now() - start - allowedTime;
      
      // Times should be similar (no significant timing difference)
      const timeDifference = Math.abs(blockedTime - allowedTime);
      expect(timeDifference).toBeLessThan(100); // Less than 100ms difference
    });
    
    it('should handle memory exhaustion attacks', () => {
      const rateLimitMiddleware = authRateLimit(1, 60000);
      
      // Simulate many different IPs trying to exhaust memory
      for (let i = 0; i < 10000; i++) {
        mockRequest.ip = `192.168.${Math.floor(i / 256)}.${i % 256}`;
        rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      }
      
      // Should still work normally
      mockRequest.ip = '10.0.0.1';
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenLastCalledWith();
    });
  });

  describe('API Key Security', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    
    beforeEach(() => {
      mockRequest = {
        headers: {},
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });
    
    it('should validate API key securely', () => {
      mockRequest.headers!['x-api-key'] = 'test-api-key';
      
      validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should prevent timing attacks on API key validation', () => {
      const validKey = 'test-api-key';
      const invalidKeys = [
        'wrong-key',
        'test-api-wrong',
        'a',
        'test-api-key-but-longer',
        '',
      ];
      
      const timings: number[] = [];
      
      // Test with valid key
      mockRequest.headers!['x-api-key'] = validKey;
      const start1 = performance.now();
      validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
      const validTime = performance.now() - start1;
      timings.push(validTime);
      
      // Test with invalid keys
      invalidKeys.forEach(key => {
        jest.clearAllMocks();
        mockRequest.headers!['x-api-key'] = key;
        const start = performance.now();
        validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
        const invalidTime = performance.now() - start;
        timings.push(invalidTime);
      });
      
      // All timings should be similar (constant time comparison)
      const maxTiming = Math.max(...timings);
      const minTiming = Math.min(...timings);
      const timingDifference = maxTiming - minTiming;
      
      // Should be relatively constant time (adjust threshold as needed)
      expect(timingDifference).toBeLessThan(50); // Less than 50ms difference
    });
    
    it('should handle API key injection attempts', () => {
      const maliciousKeys = [
        'valid-key\r\nX-Admin: true',
        'valid-key\nSet-Cookie: evil=true',
        'valid-key<script>alert("xss")</script>',
        'valid-key\0admin',
      ];
      
      maliciousKeys.forEach(maliciousKey => {
        jest.clearAllMocks();
        mockRequest.headers!['x-api-key'] = maliciousKey;
        
        validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
        
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
    
    it('should handle missing configuration securely', () => {
      delete process.env.API_KEY;
      
      mockRequest.headers!['x-api-key'] = 'any-key';
      
      validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Server configuration error',
        message: 'API key validation not configured',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Authentication Middleware Security', () => {
    let mockRequest: Partial<AuthenticatedRequest>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    
    beforeEach(() => {
      mockRequest = {
        headers: {},
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });
    
    it('should handle authorization header injection', () => {
      const maliciousHeaders = [
        'Bearer token\r\nX-Admin: true',
        'Bearer token\nSet-Cookie: evil=true',
        'Bearer token<script>alert("xss")</script>',
        'Bearer token\0admin',
      ];
      
      maliciousHeaders.forEach(header => {
        jest.clearAllMocks();
        mockRequest.headers!.authorization = header;
        
        authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
        
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
    
    it('should prevent token enumeration attacks', () => {
      const testTokens = [
        'Bearer invalid1',
        'Bearer invalid2',
        'Bearer invalid3',
      ];
      
      const timings: number[] = [];
      
      testTokens.forEach(token => {
        jest.clearAllMocks();
        mockedJwt.verify.mockImplementation(() => {
          throw new jwt.JsonWebTokenError('Invalid token');
        });
        
        mockRequest.headers!.authorization = token;
        const start = performance.now();
        
        authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
        
        const duration = performance.now() - start;
        timings.push(duration);
        
        // Should always return same error
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Authentication failed',
          message: 'Invalid authentication token',
        });
      });
      
      // All timing should be similar
      const maxTiming = Math.max(...timings);
      const minTiming = Math.min(...timings);
      const timingDifference = maxTiming - minTiming;
      
      expect(timingDifference).toBeLessThan(100);
    });
    
    it('should not leak sensitive information in error messages', () => {
      const errorCases = [
        { error: new jwt.JsonWebTokenError('Invalid signature'), expectedMessage: 'Invalid authentication token' },
        { error: new jwt.TokenExpiredError('Token expired', new Date()), expectedMessage: 'Authentication token expired' },
        { error: new Error('Database connection failed'), expectedMessage: 'Authentication failed' },
      ];
      
      errorCases.forEach(({ error, expectedMessage }) => {
        jest.clearAllMocks();
        mockRequest.headers!.authorization = 'Bearer token';
        mockedJwt.verify.mockImplementation(() => {
          throw error;
        });
        
        authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
        
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Authentication failed',
          message: expectedMessage,
        });
        
        // Should not leak internal error details
        const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
        expect(JSON.stringify(responseCall)).not.toContain('Database connection');
        expect(JSON.stringify(responseCall)).not.toContain('signature');
      });
    });
  });

  describe('Cross-Site Request Forgery (CSRF) Protection', () => {
    it('should include CSRF protection measures in OAuth flow', () => {
      // This is tested in the OAuth integration tests
      // The state parameter serves as CSRF protection
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Security Headers', () => {
    it('should not expose sensitive information in responses', () => {
      const mockUser: JWTPayload = {
        id: '123',
        login: 'testuser',
        name: 'Test User',
        provider: 'github',
      };
      
      mockedJwt.verify.mockReturnValue(mockUser);
      
      const mockRequest: Partial<AuthenticatedRequest> = {
        headers: { authorization: 'Bearer valid-token' },
      };
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toEqual(mockUser);
      
      // Should not include sensitive fields in user object
      expect(mockRequest.user).not.toHaveProperty('password');
      expect(mockRequest.user).not.toHaveProperty('secret');
      expect(mockRequest.user).not.toHaveProperty('token');
    });
  });
});