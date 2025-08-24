import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { LoginPage } from './LoginPage';
import { useTokenRefresh, useSessionTimeout } from '../../hooks/useAuth';
import { Alert } from '../shared/Alert';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  showSessionWarning?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAuth = true,
  showSessionWarning = true 
}) => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const { isRefreshing } = useTokenRefresh(isAuthenticated);
  const { showWarning, timeRemaining, extendSession } = useSessionTimeout(30); // 30 minute timeout

  // Preload critical resources when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Preload user avatar or other critical resources
      // This could be expanded based on application needs
    }
  }, [isAuthenticated]);

  if (isLoading || isRefreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            {isRefreshing ? 'Refreshing session...' : 'Loading...'}
          </p>
          {isRefreshing && (
            <p className="mt-2 text-sm text-gray-500">
              Updating your authentication credentials
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!requireAuth) {
    return (
      <>
        {showSessionWarning && showWarning && isAuthenticated && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <Alert
              type="warning"
              title="Session Expiring Soon"
              message={`Your session will expire in ${Math.ceil(timeRemaining / (60 * 1000))} minutes.`}
              actions={[
                {
                  label: 'Extend Session',
                  onClick: extendSession,
                  variant: 'primary'
                }
              ]}
            />
          </div>
        )}
        {children}
      </>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      {showSessionWarning && showWarning && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert
            type="warning"
            title="Session Expiring Soon"
            message={`Your session will expire in ${Math.ceil(timeRemaining / (60 * 1000))} minutes.`}
            actions={[
              {
                label: 'Extend Session',
                onClick: extendSession,
                variant: 'primary'
              }
            ]}
          />
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 left-4 z-50 max-w-md">
          <Alert
            type="error"
            title="Authentication Error"
            message="There was a problem with your session. Please try refreshing the page."
            dismissible
            onDismiss={() => window.location.reload()}
          />
        </div>
      )}
      
      {children}
    </>
  );
};