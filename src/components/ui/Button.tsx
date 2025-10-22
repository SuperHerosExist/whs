import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-tiger-primary-black text-white hover:bg-tiger-neutral-800 focus:ring-tiger-primary-black shadow-tiger hover:shadow-tiger-lg',
    secondary: 'bg-tiger-neutral-100 text-tiger-primary-black hover:bg-tiger-neutral-200 focus:ring-tiger-neutral-400',
    accent: 'bg-tiger-tiger-darkRed text-white hover:bg-opacity-90 focus:ring-tiger-tiger-darkRed shadow-tiger',
    ghost: 'text-tiger-neutral-700 hover:bg-tiger-neutral-100 focus:ring-tiger-neutral-400',
    outline: 'border-2 border-tiger-primary-black text-tiger-primary-black hover:bg-tiger-primary-black hover:text-white focus:ring-tiger-primary-black'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className={`animate-spin rounded-full border-b-2 border-current ${iconSizes[size]}`} />
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className={iconSizes[size]} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className={iconSizes[size]} />}
    </button>
  );
};
