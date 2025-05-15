
import React from 'react';
import { SidebarContext } from './SidebarContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarNavProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ children, className = "" }) => {
  return (
    <ScrollArea className={`h-full ${className}`}>
      <nav className="space-y-1 px-2">
        {children}
      </nav>
    </ScrollArea>
  );
};

export default SidebarNav;
