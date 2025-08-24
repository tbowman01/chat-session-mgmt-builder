import React from 'react';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertAction {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: AlertAction[];
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  actions,
  className,
}) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const styles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      title: 'text-blue-800',
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      title: 'text-green-800',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      title: 'text-red-800',
    },
  };

  const Icon = icons[type];
  const style = styles[type];

  return (
    <div
      className={clsx(
        'border rounded-lg p-4',
        style.container,
        className
      )}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={clsx('w-5 h-5', style.icon)} aria-hidden="true" />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={clsx('text-sm font-medium', style.title)}>
              {title}
            </h3>
          )}
          
          <div className={clsx('text-sm', title ? 'mt-2' : '')}>
            {message && <p>{message}</p>}
            {children}
          </div>
          
          {actions && actions.length > 0 && (
            <div className="mt-4 flex space-x-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={action.onClick}
                  className={clsx(
                    'text-xs font-medium px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                    {
                      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': action.variant === 'primary' && type === 'info',
                      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500': action.variant === 'primary' && type === 'success',
                      'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500': action.variant === 'primary' && type === 'warning',
                      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': action.variant === 'primary' && type === 'error',
                      'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 focus:ring-blue-500': action.variant === 'secondary' && type === 'info',
                      'bg-white text-green-700 border border-green-200 hover:bg-green-50 focus:ring-green-500': action.variant === 'secondary' && type === 'success',
                      'bg-white text-yellow-700 border border-yellow-200 hover:bg-yellow-50 focus:ring-yellow-500': action.variant === 'secondary' && type === 'warning',
                      'bg-white text-red-700 border border-red-200 hover:bg-red-50 focus:ring-red-500': action.variant === 'secondary' && type === 'error',
                    }
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={clsx(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  {
                    'text-blue-500 hover:bg-blue-100 focus:ring-blue-600': type === 'info',
                    'text-green-500 hover:bg-green-100 focus:ring-green-600': type === 'success',
                    'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600': type === 'warning',
                    'text-red-500 hover:bg-red-100 focus:ring-red-600': type === 'error',
                  }
                )}
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Alert };
export default Alert;