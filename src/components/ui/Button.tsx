import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Button Component
 * Reusable button with multiple variants and sizes
 * Supports loading state and full accessibility
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled, 
    children, 
    ...props 
  }, ref) => {
    // Variant styles
    const variants = {
      primary: 'bg-coffee-500 text-white hover:bg-coffee-600 focus:ring-coffee-500',
      secondary: 'bg-cream-500 text-coffee-900 hover:bg-cream-600 focus:ring-cream-500',
      ghost: 'bg-transparent text-coffee-600 hover:bg-coffee-50 focus:ring-coffee-500',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    };

    // Size styles
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-lg border border-transparent',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Variant and size styles
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <LoadingSpinner 
            size="sm" 
            className="mr-2" 
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';