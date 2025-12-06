
import React from 'react';
import { cn } from '@/lib/utils';

export interface SidebarSectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ children, title, className }) => {
  return (
    <div className={cn("py-2", className)}>
      {title && (
        <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default SidebarSection;
