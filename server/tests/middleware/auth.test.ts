import { Request, Response, NextFunction } from 'express';
import { 
  authenticateToken, 
  optionalAuth, 
  requireRole, 
  requireAdmin, 
  requireOwnership,
  authRateLimit,
  validateApiKey 
} from '../../src/middleware/auth.js';
import { generateAccessToken, blacklistToken } from '../../src/utils/jwt.js';
import { AuthenticatedRequest, User } from '../../src/types/index.js';

// Mock user for testing
const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  provider: 'local',
  createdAt: new Date(),
  updatedAt: new Date(),
  emailVerified: true,
  isActive: true,
};

const mockAdmin: User = {
  ...mockUser,
  id: 'admin-123',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
};

// Mock response object
const createMockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn() as NextFunction;

describe('Authentication Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token from Authorization header', async () => {
      const token = generateAccessToken(mockUser);
      const req = {
        headers: { authorization: `Bearer ${token}` },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      authenticateToken(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.user).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should authenticate valid token from cookies', async () => {
      const token = generateAccessToken(mockUser);
      const req = {
        headers: {},
        cookies: { access_token: token },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      authenticateToken(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
    });

    it('should reject request without token', async () => {
      const req = {
        headers: {},
        cookies: {},
      } as AuthenticatedRequest;
      const res = createMockResponse();

      authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Authentication required',
          code: 'MISSING_TOKEN',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject blacklisted token', async () => {
      const token = generateAccessToken(mockUser);
      blacklistToken(token);

      const req = {
        headers: { authorization: `Bearer ${token}` },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Token invalid',
          code: 'BLACKLISTED_TOKEN',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      const req = {
        headers: { authorization: 'Bearer invalid-token' },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid token',
          code: 'INVALID_TOKEN',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should attach user if valid token provided', async () => {
      const token = generateAccessToken(mockUser);
      const req = {
        headers: { authorization: `Bearer ${token}` },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      optionalAuth(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
    });

    it('should continue without user if no token provided', async () => {
      const req = {
        headers: {},
        cookies: {},
      } as AuthenticatedRequest;
      const res = createMockResponse();

      optionalAuth(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.user).toBeUndefined();
    });

    it('should continue without user if invalid token provided', async () => {
      const req = {
        headers: { authorization: 'Bearer invalid-token' },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      optionalAuth(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.user).toBeUndefined();
    });
  });

  describe('requireRole', () => {
    it('should allow access for user with required role', async () => {
      const req = { user: mockAdmin } as AuthenticatedRequest;
      const res = createMockResponse();
      const middleware = requireRole('admin');

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for user without required role', async () => {
      const req = { user: mockUser } as AuthenticatedRequest;
      const res = createMockResponse();
      const middleware = requireRole('admin');

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Access denied',
          code: 'INSUFFICIENT_ROLE',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access for unauthenticated request', async () => {
      const req = {} as AuthenticatedRequest;
      const res = createMockResponse();
      const middleware = requireRole('user');

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access for user with any of the required roles', async () => {
      const req = { user: mockUser } as AuthenticatedRequest;
      const res = createMockResponse();
      const middleware = requireRole('admin', 'user');

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('requireAdmin', () => {
    it('should allow access for admin user', async () => {
      const req = { user: mockAdmin } as AuthenticatedRequest;
      const res = createMockResponse();

      requireAdmin(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for non-admin user', async () => {
      const req = { user: mockUser } as AuthenticatedRequest;
      const res = createMockResponse();

      requireAdmin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireOwnership', () => {
    it('should allow access for resource owner', async () => {
      const req = {
        user: mockUser,
        params: { userId: mockUser.id },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      requireOwnership(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow access for admin user', async () => {
      const req = {
        user: mockAdmin,
        params: { userId: mockUser.id },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      requireOwnership(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for non-owner non-admin user', async () => {
      const req = {
        user: mockUser,
        params: { userId: 'other-user-id' },
      } as AuthenticatedRequest;
      const res = createMockResponse();

      requireOwnership(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Access denied',
          code: 'OWNERSHIP_VIOLATION',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access without userId parameter', async () => {
      const req = {
        user: mockUser,
        params: {},
        body: {},
        query: {},
      } as AuthenticatedRequest;
      const res = createMockResponse();

      requireOwnership(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Bad request',
          code: 'MISSING_USER_ID',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authRateLimit', () => {
    it('should allow requests within rate limit', async () => {
      const middleware = authRateLimit(5, 60000); // 5 attempts per minute
      const req = { ip: '127.0.0.1' } as Request;
      const res = createMockResponse();

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should block requests exceeding rate limit', async () => {
      const middleware = authRateLimit(2, 60000); // 2 attempts per minute
      const req = { ip: '127.0.0.1', get: jest.fn() } as any;
      const res = createMockResponse();

      // Make 3 requests (exceeding limit of 2)
      middleware(req, res, mockNext);
      middleware(req, res, mockNext);
      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Too many attempts',
          code: 'AUTH_RATE_LIMIT_EXCEEDED',
        })
      );
    });
  });

  describe('validateApiKey', () => {
    const originalApiKey = process.env.API_KEY;

    beforeAll(() => {
      process.env.API_KEY = 'test-api-key';
    });

    afterAll(() => {
      if (originalApiKey) {
        process.env.API_KEY = originalApiKey;
      } else {
        delete process.env.API_KEY;
      }
    });

    it('should allow request with valid API key', async () => {
      const req = {
        headers: { 'x-api-key': 'test-api-key' },
      } as Request;
      const res = createMockResponse();

      validateApiKey(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject request with invalid API key', async () => {
      const req = {
        headers: { 'x-api-key': 'invalid-key' },
        ip: '127.0.0.1',
        get: jest.fn(),
        path: '/api/test',
      } as any;
      const res = createMockResponse();

      validateApiKey(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid API key',
          code: 'INVALID_API_KEY',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request without API key', async () => {
      const req = { headers: {} } as Request;
      const res = createMockResponse();

      validateApiKey(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'API key required',
          code: 'MISSING_API_KEY',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});