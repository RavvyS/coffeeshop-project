import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card Component
 * Container component with consistent styling and optional hover effects
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        className={cn(
          // Base styles
          'bg-white rounded-xl shadow-soft border border-gray-100',
          // Padding
          paddingClasses[padding],
          // Hover effect
          hover && 'hover:shadow-coffee hover:border-coffee-200 transition-all duration-300 cursor-pointer',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
