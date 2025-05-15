
import React from 'react';

interface ThemeColorExampleProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: boolean;
  className?: string;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({
  color = 'primary',
  size = 'md',
  label = false,
  className = ''
}) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  // Map color to Tailwind classes
  const colorClass = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    background: 'bg-background border border-border',
    foreground: 'bg-foreground',
    muted: 'bg-muted',
    card: 'bg-card border border-border',
    destructive: 'bg-destructive',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[color] || 'bg-primary';

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className={`${sizeClass[size]} ${colorClass} rounded-md shadow-sm`} />
      {label && (
        <span className="text-xs font-mono text-muted-foreground">{color}</span>
      )}
    </div>
  );
};

export default ThemeColorExample;
