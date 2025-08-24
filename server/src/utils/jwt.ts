import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request } from 'express';
import logger from './logger.js';
import { config } from './config.js';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  provider?: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  provider?: string;
  lastLogin?: Date;
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(user: AuthenticatedUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    provider: user.provider,
  };

  return jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.accessTokenExpiry,
    issuer: config.auth.issuer,
    audience: config.auth.audience,
  });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(user: AuthenticatedUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    provider: user.provider,
  };

  return jwt.sign(payload, config.auth.refreshTokenSecret, {
    expiresIn: config.auth.refreshTokenExpiry,
    issuer: config.auth.issuer,
    audience: config.auth.audience,
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(user: AuthenticatedUser): TokenPair {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret, {
      issuer: config.auth.issuer,
      audience: config.auth.audience,
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    logger.warn('Invalid access token', { error: (error as Error).message });
    return null;
  }
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, config.auth.refreshTokenSecret, {
      issuer: config.auth.issuer,
      audience: config.auth.audience,
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    logger.warn('Invalid refresh token', { error: (error as Error).message });
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Extract token from cookies
 */
export function extractTokenFromCookie(req: Request, cookieName: string = 'access_token'): string | null {
  return req.cookies?.[cookieName] || null;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate secure random token for password reset, email verification, etc.
 */
export function generateSecureToken(): string {
  return jwt.sign(
    { random: Math.random().toString(36) },
    config.auth.jwtSecret,
    { expiresIn: '1h' }
  );
}

/**
 * Validate token expiry
 */
export function isTokenExpired(payload: JWTPayload): boolean {
  if (!payload.exp) {
    return true;
  }
  
  return Date.now() >= payload.exp * 1000;
}

/**
 * Get token expiry time
 */
export function getTokenExpiry(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (decoded?.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Blacklist token (in production, store in Redis/database)
 */
const tokenBlacklist = new Set<string>();

export function blacklistToken(token: string): void {
  tokenBlacklist.add(token);
  
  // Log the blacklisting
  logger.info('Token blacklisted', { 
    tokenHash: jwt.decode(token) ? 'valid_format' : 'invalid_format'
  });
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}

/**
 * Clean up expired tokens from blacklist (run periodically)
 */
export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const token of tokenBlacklist) {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (decoded?.exp && decoded.exp * 1000 < now) {
        tokenBlacklist.delete(token);
      }
    } catch {
      // If token can't be decoded, remove it
      tokenBlacklist.delete(token);
    }
  }
}

// Clean up expired tokens every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

/**
 * Create JWT cookie options
 */
export function getJWTCookieOptions(isRefreshToken: boolean = false) {
  const maxAge = isRefreshToken 
    ? parseInt(config.auth.refreshTokenExpiry.replace(/\D/g, '')) * (config.auth.refreshTokenExpiry.includes('d') ? 86400000 : 3600000)
    : parseInt(config.auth.accessTokenExpiry.replace(/\D/g, '')) * (config.auth.accessTokenExpiry.includes('h') ? 3600000 : 60000);

  return {
    httpOnly: true,
    secure: config.environment === 'production',
    sameSite: 'strict' as const,
    maxAge,
    path: '/',
  };
}