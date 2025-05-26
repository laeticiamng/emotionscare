
import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <div
    className={cn(
      'relative overflow-hidden',
      className
    )}
    {...props}
  >
    <div className="h-full w-full rounded-[inherit] overflow-auto">
      {children}
    </div>
  </div>
);

export const ScrollBar: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex touch-none select-none transition-colors', className)} />
);
