import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'cyan' | 'purple' | 'white' | 'inverted' | 'subtle';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const variantStyles = {
    default: 'bg-zinc-900/90 text-zinc-200 border-zinc-800',
    white: 'bg-white text-black font-bold border-white shadow-sm',
    inverted: 'bg-zinc-800 text-zinc-100 border-zinc-700',
    subtle: 'bg-zinc-950 text-zinc-400 border-zinc-800/80',
    success: 'bg-zinc-900 text-zinc-100 border-zinc-700',
    warning: 'bg-zinc-800 text-zinc-200 border-zinc-700',
    error: 'bg-zinc-900 text-zinc-300 border-zinc-700',
    cyan: 'bg-zinc-900 text-zinc-100 border-zinc-700',
    purple: 'bg-zinc-900 text-zinc-200 border-zinc-700'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-md border tracking-wide uppercase ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {text}
    </span>
  );
};

