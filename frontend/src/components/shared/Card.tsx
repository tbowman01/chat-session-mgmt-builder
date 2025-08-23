import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
  selected = false,
  onClick,
  disabled = false,
}) => {
  const isClickable = !!onClick && !disabled;

  const baseStyles = 'bg-white rounded-lg transition-all duration-200';
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const borderStyles = border ? 'border border-gray-200' : '';
  
  const hoverStyles = hover && !disabled ? 'hover:shadow-md hover:-translate-y-0.5' : '';
  
  const selectedStyles = selected ? 'ring-2 ring-primary-500 border-primary-300' : '';
  
  const clickableStyles = isClickable ? 'cursor-pointer' : '';
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div
      className={clsx(
        baseStyles,
        paddingStyles[padding],
        shadowStyles[shadow],
        borderStyles,
        hoverStyles,
        selectedStyles,
        clickableStyles,
        disabledStyles,
        className
      )}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

// Card subcomponents
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4;
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className, 
  level = 3 
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const sizeStyles = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
    4: 'text-base',
  };

  return (
    <Tag className={clsx('font-semibold text-gray-900', sizeStyles[level], className)}>
      {children}
    </Tag>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  children, 
  className 
}) => (
  <p className={clsx('text-sm text-gray-600', className)}>
    {children}
  </p>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
);

export default Card;