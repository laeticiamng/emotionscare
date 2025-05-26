
import React from 'react';
import { cn } from '@/lib/utils';

interface TopNavProps {
  className?: string;
}

export const TopNav: React.FC<TopNavProps> = ({ className }) => {
  return (
    <header className={cn('h-14 border-b bg-background', className)}>
      <div className="flex items-center justify-between px-4 h-full">
        <h1 className="text-lg font-semibold">EmotionsCare</h1>
      </div>
    </header>
  );
};
