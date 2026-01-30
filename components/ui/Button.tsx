'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled = false,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#007AFF] dark:bg-[#0A84FF] text-white hover:opacity-90 focus:ring-[#007AFF] disabled:hover:opacity-50',
    secondary: 'bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-white/20 border border-white/30 disabled:hover:bg-white/20',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:hover:bg-transparent',
    outline: 'bg-transparent text-[#007AFF] dark:text-[#0A84FF] border-2 border-[#007AFF] dark:border-[#0A84FF] hover:bg-[#007AFF]/10 dark:hover:bg-[#0A84FF]/10 disabled:opacity-50 disabled:hover:bg-transparent',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};
