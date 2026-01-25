import React, {} from 'react';
import { cn } from '@/lib/utils';

interface PageRootProps {
  children: React.ReactNode;
  className?: string;
  adaptToMood?: boolean;
}

export const PageRoot: React.FC<PageRootProps> = ({ 
  children, 
  className,
  adaptToMood = false
}) => {
  return (
    <div 
      data-testid="page-root" 
      className={cn(
        'min-h-screen transition-colors duration-300 bg-gradient-to-br from-background via-background/95 to-primary/5',
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageRoot;