/**
 * Custom hooks for authentication functionality
 */

import { useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { getStoredTokenData, isTokenExpired, willTokenExpireSoon } from '../utils/auth';

/**
 * Hook for automatic token refresh
 */
export const useTokenRefresh = (enabled: boolean = true) => {
  const { refreshToken, logout, isAuthenticated } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTokenRefresh = useCallback(async () => {
    if (!enabled || !isAuthenticated || isRefreshing) return;

    const tokenData = getStoredTokenData();
    if (!tokenData) return;

    // Check if token will expire soon
    if (willTokenExpireSoon(tokenData, 5)) {
      setIsRefreshing(true);
      try {
        const success = await refreshToken();
        if (!success) {
          logout();
        }
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        logout();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [enabled, isAuthenticated, isRefreshing, refreshToken, logout]);

  useEffect(() => {
    if (!enabled) return;

    // Check immediately
    handleTokenRefresh();

    // Set up interval to check every minute
    const interval = setInterval(handleTokenRefresh, 60000);

    return () => clearInterval(interval);
  }, [handleTokenRefresh, enabled]);

  return { isRefreshing };
};

/**
 * Hook for handling authentication errors with retry logic
 */
export const useAuthErrorHandler = () => {
  const { error, clearError } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [canRetry, setCanRetry] = useState(false);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      clearError();
    } else {
      setCanRetry(false);
    }
  }, [retryCount, clearError]);

  useEffect(() => {
    if (error) {
      // Determine if error is retryable
      const retryableErrors = ['NETWORK_ERROR', 'TIMEOUT', 'FETCH_ERROR'];
      const isRetryable = retryableErrors.some(code => error.code === code);
      setCanRetry(isRetryable && retryCount < 3);
    } else {
      setRetryCount(0);
      setCanRetry(false);
    }
  }, [error, retryCount]);

  return {
    error,
    canRetry,
    retryCount,
    handleRetry,
    clearError,
  };
};

/**
 * Hook for session timeout management
 */
export const useSessionTimeout = (timeoutMinutes: number = 30) => {
  const { logout, isAuthenticated } = useAuth();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  const checkTimeout = useCallback(() => {
    if (!isAuthenticated) return;

    const now = Date.now();
    const timeSinceActivity = now - lastActivity;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = timeoutMs - (5 * 60 * 1000); // Show warning 5 minutes before timeout

    if (timeSinceActivity >= timeoutMs) {
      logout();
    } else if (timeSinceActivity >= warningMs && !showWarning) {
      setShowWarning(true);
    }
  }, [isAuthenticated, lastActivity, timeoutMinutes, logout, showWarning]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetActivity, { passive: true });
    });

    const interval = setInterval(checkTimeout, 60000); // Check every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivity);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated, resetActivity, checkTimeout]);

  const extendSession = useCallback(() => {
    resetActivity();
  }, [resetActivity]);

  return {
    showWarning,
    timeRemaining: Math.max(0, (timeoutMinutes * 60 * 1000) - (Date.now() - lastActivity)),
    extendSession,
  };
};

/**
 * Hook for managing authentication state persistence
 */
export const useAuthPersistence = () => {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      // Store minimal user info for quick access
      const userInfo = {
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url,
        provider: user.provider,
      };
      localStorage.setItem('user_info', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('user_info');
    }
  }, [user, isAuthenticated]);

  const getStoredUserInfo = useCallback(() => {
    try {
      const stored = localStorage.getItem('user_info');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  return { getStoredUserInfo };
};

/**
 * Hook for authentication analytics and metrics
 */
export const useAuthMetrics = () => {
  const { user, isAuthenticated } = useAuth();
  
  const trackAuthEvent = useCallback((event: string, data?: Record<string, any>) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.log('Auth Event:', event, data);
    }
    
    // Here you could integrate with analytics services
    // Example: analytics.track(event, { ...data, userId: user?.id });
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user) {
      trackAuthEvent('user_authenticated', {
        provider: user.provider,
        userId: user.id,
      });
    }
  }, [isAuthenticated, user, trackAuthEvent]);

  return { trackAuthEvent };
};