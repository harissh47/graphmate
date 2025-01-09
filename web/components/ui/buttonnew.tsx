import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonNewProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'md' | 'lg' | 'full';
}

const ButtonNew = React.forwardRef<HTMLButtonElement, ButtonNewProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    rounded = 'full', 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
      xl: 'h-14 px-8 text-xl',
    };

    const roundedStyles = {
      none: 'rounded-none',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const combinedStyles = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      roundedStyles[rounded],
      className
    );

    return (
      <button ref={ref} className={combinedStyles} {...props} />
    );
  }
);

ButtonNew.displayName = 'ButtonNew';

export { ButtonNew };
