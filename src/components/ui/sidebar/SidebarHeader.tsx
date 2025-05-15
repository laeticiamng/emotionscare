
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  children,
  className
}) => {
  return (
    <div className={cn("py-4 px-2", className)}>
      {children}
    </div>
  );
};

export default SidebarHeader;
