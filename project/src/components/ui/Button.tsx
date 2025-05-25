import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        clsx(
          'btn',
          {
            'btn-primary': variant === 'primary',
            'btn-secondary': variant === 'secondary',
            'btn-outline': variant === 'outline',
            'btn-danger': variant === 'danger',
            'bg-transparent hover:bg-gray-100 text-gray-700': variant === 'ghost',
            'btn-sm': size === 'sm',
            'btn-md': size === 'md',
            'btn-lg': size === 'lg',
            'w-full': fullWidth,
            'opacity-50 cursor-not-allowed': disabled,
            'space-x-2': icon && children,
          },
          className
        )
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
};

export default Button;