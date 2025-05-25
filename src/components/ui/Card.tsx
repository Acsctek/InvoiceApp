import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  hoverable = false,
}) => {
  return (
    <div 
      className={twMerge(
        clsx(
          'card p-5',
          {
            'transition-shadow hover:shadow-md': hoverable,
          },
          className
        )
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={twMerge('mb-4', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className 
}) => {
  return (
    <h3 className={twMerge('text-xl font-medium', className)}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={twMerge('', className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={twMerge('mt-4 pt-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};