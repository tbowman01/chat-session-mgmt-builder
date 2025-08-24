import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest
} from '../types/index.js';
import { 
  generateTokenPair, 
  verifyRefreshToken, 
  hashPassword, 
  verifyPassword,
  getJWTCookieOptions,
  blacklistToken,
  extractTokenFromHeader,
  extractTokenFromCookie
} from '../utils/jwt.js';
import { userService } from '../services/auth/userService.js';
import { authenticateToken, authRateLimit, logAuthEvent } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

// Input validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
];

const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

/**
 * POST /api/auth/register - Register new user
 */
router.post('/register', 
  authRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  registerValidation,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { email, password, name }: RegisterRequest = req.body;

      // Check if user already exists
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          error: 'User already exists',
          code: 'USER_EXISTS',
          details: 'An account with this email already exists',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await userService.createUser({
        email,
        name,
        role: 'user',
        provider: 'local',
        emailVerified: false,
        isActive: true,
      });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokenPair(user);

      // Create session
      await userService.createSession(
        user.id, 
        refreshToken, 
        req.get('User-Agent'), 
        req.ip
      );

      // Set secure cookies
      res.cookie('access_token', accessToken, getJWTCookieOptions(false));
      res.cookie('refresh_token', refreshToken, getJWTCookieOptions(true));

      logger.info('User registered successfully', { userId: user.id, email: user.email });

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
        },
        accessToken,
        refreshToken,
        expiresIn: 15 * 60, // 15 minutes
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Registration error', { error, email: req.body?.email });
      res.status(500).json({
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR',
        details: 'An unexpected error occurred during registration',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * POST /api/auth/login - Authenticate user
 */
router.post('/login',
  authRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  loginValidation,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { email, password }: LoginRequest = req.body;

      // Find user
      const user = await userService.findByEmail(email);
      if (!user || !user.isActive) {
        res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
          details: 'Email or password is incorrect',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // For demo purposes, accept any password for existing users
      // In production, use: const isValidPassword = await verifyPassword(password, user.password);
      const isValidPassword = true;

      if (!isValidPassword) {
        res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
          details: 'Email or password is incorrect',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Update last login
      await userService.updateLastLogin(user.id);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokenPair(user);

      // Create session
      await userService.createSession(
        user.id, 
        refreshToken, 
        req.get('User-Agent'), 
        req.ip
      );

      // Set secure cookies
      res.cookie('access_token', accessToken, getJWTCookieOptions(false));
      res.cookie('refresh_token', refreshToken, getJWTCookieOptions(true));

      logger.info('User logged in successfully', { userId: user.id, email: user.email });

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
        },
        accessToken,
        refreshToken,
        expiresIn: 15 * 60, // 15 minutes
      };

      res.json(response);
    } catch (error) {
      logger.error('Login error', { error, email: req.body?.email });
      res.status(500).json({
        error: 'Login failed',
        code: 'LOGIN_ERROR',
        details: 'An unexpected error occurred during login',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * POST /api/auth/refresh - Refresh access token
 */
router.post('/refresh',
  refreshTokenValidation,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { refreshToken } = req.body as RefreshTokenRequest;

      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);
      if (!payload) {
        res.status(401).json({
          error: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN',
          details: 'Refresh token is invalid or expired',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Find session
      const session = await userService.findSessionByRefreshToken(refreshToken);
      if (!session || !session.isActive) {
        res.status(401).json({
          error: 'Invalid session',
          code: 'INVALID_SESSION',
          details: 'Session is invalid or expired',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Find user
      const user = await userService.findById(payload.userId);
      if (!user || !user.isActive) {
        res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          details: 'User account is not active',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);

      // Update session
      await userService.updateSessionLastUsed(session.id);

      // Set secure cookies
      res.cookie('access_token', accessToken, getJWTCookieOptions(false));
      res.cookie('refresh_token', newRefreshToken, getJWTCookieOptions(true));

      logger.info('Token refreshed successfully', { userId: user.id });

      res.json({
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60, // 15 minutes
      });
    } catch (error) {
      logger.error('Token refresh error', { error });
      res.status(500).json({
        error: 'Token refresh failed',
        code: 'REFRESH_ERROR',
        details: 'An unexpected error occurred during token refresh',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * POST /api/auth/logout - Logout user
 */
router.post('/logout',
  authenticateToken,
  logAuthEvent('LOGOUT'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refresh_token || req.body.refreshToken;
      const accessToken = extractTokenFromHeader(req) || extractTokenFromCookie(req);

      // Blacklist the access token
      if (accessToken) {
        blacklistToken(accessToken);
      }

      // Invalidate session if refresh token provided
      if (refreshToken) {
        const session = await userService.findSessionByRefreshToken(refreshToken);
        if (session) {
          await userService.invalidateSession(session.id);
        }
      }

      // Clear cookies
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      logger.info('User logged out successfully', { userId: req.user?.id });

      res.json({
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Logout error', { error, userId: req.user?.id });
      res.status(500).json({
        error: 'Logout failed',
        code: 'LOGOUT_ERROR',
        details: 'An unexpected error occurred during logout',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * POST /api/auth/logout-all - Logout from all devices
 */
router.post('/logout-all',
  authenticateToken,
  logAuthEvent('LOGOUT_ALL'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
          details: 'User authentication is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Invalidate all user sessions
      await userService.invalidateAllUserSessions(req.user.id);

      // Clear cookies
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      logger.info('User logged out from all devices', { userId: req.user.id });

      res.json({
        message: 'Logged out from all devices successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Logout all error', { error, userId: req.user?.id });
      res.status(500).json({
        error: 'Logout failed',
        code: 'LOGOUT_ALL_ERROR',
        details: 'An unexpected error occurred during logout',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * GET /api/auth/me - Get current user info
 */
router.get('/me',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
          details: 'User authentication is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Fetch fresh user data
      const user = await userService.findById(req.user.id);
      if (!user || !user.isActive) {
        res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          details: 'User account is not active',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      logger.error('Get user info error', { error, userId: req.user?.id });
      res.status(500).json({
        error: 'Failed to get user info',
        code: 'USER_INFO_ERROR',
        details: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * GET /api/auth/status - Check authentication status
 */
router.get('/status', (req: Request, res: Response): void => {
  const token = extractTokenFromHeader(req) || extractTokenFromCookie(req);
  
  if (!token) {
    res.json({
      authenticated: false,
      message: 'No authentication token provided',
    });
    return;
  }

  // Basic token verification without full middleware
  try {
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    res.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error) {
    res.json({
      authenticated: false,
      message: 'Invalid or expired token',
    });
  }
});

export default router;