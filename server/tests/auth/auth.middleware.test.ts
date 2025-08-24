import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  authenticateToken,
  optionalAuthentication,
  generateToken,
  verifyToken,
  extractToken,
  authRateLimit,
  validateApiKey,
  AuthenticatedRequest,
  JWTPayload,
} from '../../src/middleware/auth/index.js';

// Mock jwt module
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Authentication Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  
  const originalEnv = process.env;
  
  beforeEach(() => {
    mockRequest = {
      headers: {},
      ip: '127.0.0.1',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    
    // Reset environment
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = 'test-secret';
    process.env.API_KEY = 'test-api-key';
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = {
        id: '123',
        login: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'github' as const,
      };
      
      mockedJwt.sign.mockReturnValue('mocked-jwt-token');
      
      const token = generateToken(user);
      
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        user,
        'test-secret',
        {
          expiresIn: '7d',
          issuer: 'chat-session-mgmt-builder',
          audience: 'chat-session-mgmt-users',
        }
      );
      expect(token).toBe('mocked-jwt-token');
    });
    
    it('should use custom expiration from environment', () => {
      process.env.JWT_EXPIRES_IN = '1h';
      
      const user = {
        id: '123',
        login: 'testuser',
        name: 'Test User',
        provider: 'github' as const,
      };
      
      mockedJwt.sign.mockReturnValue('token');
      
      generateToken(user);
      
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        user,
        'test-secret',
        expect.objectContaining({
          expiresIn: '1h',
        })
      );
    });
    
    it('should throw error when token generation fails', () => {
      mockedJwt.sign.mockImplementation(() => {
        throw new Error('JWT error');
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

  describe('verifyToken', () => {
    const mockPayload: JWTPayload = {
      id: '123',
      login: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      provider: 'github',
    };
    
    it('should verify and return valid token payload', () => {
      mockedJwt.verify.mockReturnValue(mockPayload);
      
      const result = verifyToken('valid-token');
      
      expect(mockedJwt.verify).toHaveBeenCalledWith(
        'valid-token',
        'test-secret',
        {
          issuer: 'chat-session-mgmt-builder',
          audience: 'chat-session-mgmt-users',
        }
      );
      expect(result).toEqual(mockPayload);
    });
    
    it('should throw error for invalid token', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });
      
      expect(() => verifyToken('invalid-token')).toThrow('Invalid authentication token');
    });
    
    it('should throw error for expired token', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });
      
      expect(() => verifyToken('expired-token')).toThrow('Authentication token expired');
    });
    
    it('should throw error for token not yet valid', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new jwt.NotBeforeError('Token not yet valid', new Date());
      });
      
      expect(() => verifyToken('future-token')).toThrow('Authentication token not yet valid');
    });
    
    it('should throw generic error for other verification failures', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Unknown error');
      });
      
      expect(() => verifyToken('token')).toThrow('Token verification failed');
    });
  });

  describe('extractToken', () => {
    it('should extract token from Bearer header', () => {
      const token = extractToken('Bearer valid-jwt-token');
      expect(token).toBe('valid-jwt-token');
    });
    
    it('should return null for missing header', () => {
      const token = extractToken(undefined);
      expect(token).toBeNull();
    });
    
    it('should return null for invalid header format', () => {
      expect(extractToken('Invalid header')).toBeNull();
      expect(extractToken('Bearer')).toBeNull();
      expect(extractToken('Basic token')).toBeNull();
      expect(extractToken('Bearer token1 token2')).toBeNull();
    });
  });

  describe('authenticateToken middleware', () => {
    const mockPayload: JWTPayload = {
      id: '123',
      login: 'testuser',
      name: 'Test User',
      provider: 'github',
    };
    
    it('should authenticate valid token and call next', () => {
      mockRequest.headers!.authorization = 'Bearer valid-token';
      mockedJwt.verify.mockReturnValue(mockPayload);
      
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockRequest.user).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should return 401 for missing authorization header', () => {
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Access denied',
        message: 'Authentication token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 401 for invalid token format', () => {
      mockRequest.headers!.authorization = 'Invalid header';
      
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Access denied',
        message: 'Authentication token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 401 for invalid token', () => {
      mockRequest.headers!.authorization = 'Bearer invalid-token';
      mockedJwt.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });
      
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication failed',
        message: 'Invalid authentication token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should handle non-Error exceptions', () => {
      mockRequest.headers!.authorization = 'Bearer token';
      mockedJwt.verify.mockImplementation(() => {
        throw 'String error';
      });
      
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication failed',
        message: 'Authentication failed',
      });
    });
  });

  describe('optionalAuthentication middleware', () => {
    const mockPayload: JWTPayload = {
      id: '123',
      login: 'testuser',
      name: 'Test User',
      provider: 'github',
    };
    
    it('should add user info if valid token present', () => {
      mockRequest.headers!.authorization = 'Bearer valid-token';
      mockedJwt.verify.mockReturnValue(mockPayload);
      
      optionalAuthentication(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockRequest.user).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should continue without user info if no token present', () => {
      optionalAuthentication(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should continue without user info if invalid token', () => {
      mockRequest.headers!.authorization = 'Bearer invalid-token';
      mockedJwt.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });
      
      optionalAuthentication(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should handle exceptions gracefully', () => {
      mockRequest.headers!.authorization = 'Bearer token';
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      
      optionalAuthentication(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('validateApiKey middleware', () => {
    it('should allow request with valid API key', () => {
      mockRequest.headers!['x-api-key'] = 'test-api-key';
      
      validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should return 401 for missing API key', () => {
      validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid API key',
        message: 'Valid API key required for this endpoint',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 401 for invalid API key', () => {
      mockRequest.headers!['x-api-key'] = 'wrong-api-key';
      
      validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid API key',
        message: 'Valid API key required for this endpoint',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 500 if API key not configured', () => {
      delete process.env.API_KEY;
      
      validateApiKey(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Server configuration error',
        message: 'API key validation not configured',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authRateLimit middleware', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('should allow requests under rate limit', () => {
      const rateLimitMiddleware = authRateLimit(3, 60000);
      mockRequest.ip = '192.168.1.1';
      
      // First request
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      
      // Second request
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(2);
      
      // Third request
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(3);
    });
    
    it('should block requests over rate limit', () => {
      const rateLimitMiddleware = authRateLimit(2, 60000);
      mockRequest.ip = '192.168.1.1';
      
      // First two requests - should pass
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(2);
      
      // Third request - should be blocked
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Too many authentication attempts',
        message: expect.stringContaining('Rate limit exceeded'),
        retryAfter: expect.any(Number),
      });
      expect(mockNext).toHaveBeenCalledTimes(2); // Not called for blocked request
    });
    
    it('should reset rate limit after window expires', () => {
      const windowMs = 60000;
      const rateLimitMiddleware = authRateLimit(1, windowMs);
      mockRequest.ip = '192.168.1.1';
      
      // First request - should pass
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      
      // Second request immediately - should be blocked
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      
      // Fast-forward time past the window
      jest.advanceTimersByTime(windowMs + 1000);
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Third request after window - should pass again
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should handle different IP addresses separately', () => {
      const rateLimitMiddleware = authRateLimit(1, 60000);
      
      // First IP
      mockRequest.ip = '192.168.1.1';
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Second IP - should be allowed
      mockRequest.ip = '192.168.1.2';
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    
    it('should handle missing IP address', () => {
      const rateLimitMiddleware = authRateLimit(2, 60000);
      mockRequest.ip = undefined;
      
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      rateLimitMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(2);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle missing JWT_SECRET gracefully', () => {
      delete process.env.JWT_SECRET;
      
      const user = {
        id: '123',
        login: 'testuser',
        name: 'Test User',
        provider: 'github' as const,
      };
      
      // Should use default secret
      mockedJwt.sign.mockReturnValue('token');
      const token = generateToken(user);
      
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        user,
        'development-secret-key',
        expect.any(Object)
      );
    });
    
    it('should handle malformed authorization header', () => {
      mockRequest.headers!.authorization = 'Malformed';
      
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should handle empty authorization header', () => {
      mockRequest.headers!.authorization = '';
      
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});