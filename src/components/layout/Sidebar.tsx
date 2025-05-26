
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside className={cn('w-64 bg-background border-r', className)}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Navigation</h2>
      </div>
    </aside>
  );
};
