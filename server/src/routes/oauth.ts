import { Router, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateTokenPair, getJWTCookieOptions } from '../utils/jwt.js';
import { userService } from '../services/auth/userService.js';
import { config } from '../utils/config.js';
import logger from '../utils/logger.js';
import { OAuthProfile } from '../types/index.js';

const router = Router();

// Initialize Passport
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userService.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// GitHub OAuth Strategy
if (config.auth.github.clientId && config.auth.github.clientSecret) {
  passport.use(new GitHubStrategy({
    clientID: config.auth.github.clientId,
    clientSecret: config.auth.github.clientSecret,
    callbackURL: config.auth.github.callbackUrl,
    scope: ['user:email'],
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in GitHub profile'), null);
      }

      const oauthProfile: OAuthProfile = {
        id: profile.id,
        email,
        name: profile.displayName || profile.username,
        avatar: profile.photos?.[0]?.value,
        provider: 'github',
      };

      // Check if user exists by provider ID
      let user = await userService.findByProviderId('github', profile.id);
      
      if (!user) {
        // Check if user exists by email
        user = await userService.findByEmail(email);
        
        if (user) {
          // Link GitHub account to existing user
          await userService.updateUser(user.id, {
            providerId: profile.id,
            avatar: oauthProfile.avatar,
          });
          logger.info('GitHub account linked to existing user', { userId: user.id, email });
        } else {
          // Create new user
          user = await userService.createFromOAuth(oauthProfile);
          logger.info('New user created from GitHub OAuth', { userId: user.id, email });
        }
      } else {
        // Update existing user info
        await userService.updateUser(user.id, {
          name: oauthProfile.name,
          avatar: oauthProfile.avatar,
        });
        await userService.updateLastLogin(user.id);
      }

      return done(null, user);
    } catch (error) {
      logger.error('GitHub OAuth error', { error, profileId: profile?.id });
      return done(error, null);
    }
  }));
}

// Google OAuth Strategy
if (config.auth.google.clientId && config.auth.google.clientSecret) {
  passport.use(new GoogleStrategy({
    clientID: config.auth.google.clientId,
    clientSecret: config.auth.google.clientSecret,
    callbackURL: config.auth.google.callbackUrl,
    scope: ['profile', 'email'],
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      const oauthProfile: OAuthProfile = {
        id: profile.id,
        email,
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        provider: 'google',
      };

      // Check if user exists by provider ID
      let user = await userService.findByProviderId('google', profile.id);
      
      if (!user) {
        // Check if user exists by email
        user = await userService.findByEmail(email);
        
        if (user) {
          // Link Google account to existing user
          await userService.updateUser(user.id, {
            providerId: profile.id,
            avatar: oauthProfile.avatar,
          });
          logger.info('Google account linked to existing user', { userId: user.id, email });
        } else {
          // Create new user
          user = await userService.createFromOAuth(oauthProfile);
          logger.info('New user created from Google OAuth', { userId: user.id, email });
        }
      } else {
        // Update existing user info
        await userService.updateUser(user.id, {
          name: oauthProfile.name,
          avatar: oauthProfile.avatar,
        });
        await userService.updateLastLogin(user.id);
      }

      return done(null, user);
    } catch (error) {
      logger.error('Google OAuth error', { error, profileId: profile?.id });
      return done(error, null);
    }
  }));
}

/**
 * GET /api/auth/github - Initiate GitHub OAuth
 */
router.get('/github', 
  passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * GET /api/auth/github/callback - GitHub OAuth callback
 */
router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/login?error=github_auth_failed',
    session: false 
  }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.redirect('/login?error=github_auth_failed');
        return;
      }

      // Generate JWT tokens
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

      logger.info('GitHub OAuth login successful', { userId: user.id, email: user.email });

      // Redirect to frontend with success
      const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${redirectUrl}/dashboard?auth_success=true`);
    } catch (error) {
      logger.error('GitHub OAuth callback error', { error });
      res.redirect('/login?error=github_callback_error');
    }
  }
);

/**
 * GET /api/auth/google - Initiate Google OAuth
 */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * GET /api/auth/google/callback - Google OAuth callback
 */
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login?error=google_auth_failed',
    session: false 
  }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.redirect('/login?error=google_auth_failed');
        return;
      }

      // Generate JWT tokens
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

      logger.info('Google OAuth login successful', { userId: user.id, email: user.email });

      // Redirect to frontend with success
      const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${redirectUrl}/dashboard?auth_success=true`);
    } catch (error) {
      logger.error('Google OAuth callback error', { error });
      res.redirect('/login?error=google_callback_error');
    }
  }
);

/**
 * GET /api/auth/providers - Get available OAuth providers
 */
router.get('/providers', (req: Request, res: Response): void => {
  const providers = [];

  if (config.auth.github.clientId && config.auth.github.clientSecret) {
    providers.push({
      name: 'github',
      displayName: 'GitHub',
      authUrl: '/api/auth/github',
      enabled: true,
    });
  }

  if (config.auth.google.clientId && config.auth.google.clientSecret) {
    providers.push({
      name: 'google',
      displayName: 'Google',
      authUrl: '/api/auth/google',
      enabled: true,
    });
  }

  res.json({
    providers,
    localAuth: true,
  });
});

/**
 * DELETE /api/auth/unlink/:provider - Unlink OAuth provider
 */
router.delete('/unlink/:provider',
  // authenticateToken middleware would be imported and used here
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { provider } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({
          error: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!['github', 'google'].includes(provider)) {
        res.status(400).json({
          error: 'Invalid provider',
          code: 'INVALID_PROVIDER',
          details: 'Provider must be github or google',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Don't allow unlinking if it's the only authentication method
      if (user.provider === provider && !user.emailVerified) {
        res.status(400).json({
          error: 'Cannot unlink',
          code: 'CANNOT_UNLINK_PRIMARY',
          details: 'Cannot unlink the primary authentication method without email verification',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Update user to remove provider info
      await userService.updateUser(user.id, {
        provider: user.provider === provider ? 'local' : user.provider,
        providerId: user.provider === provider ? undefined : user.providerId,
      });

      logger.info('OAuth provider unlinked', { userId: user.id, provider });

      res.json({
        message: `${provider} account unlinked successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('OAuth unlink error', { error, provider: req.params.provider });
      res.status(500).json({
        error: 'Failed to unlink provider',
        code: 'UNLINK_ERROR',
        details: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export default router;