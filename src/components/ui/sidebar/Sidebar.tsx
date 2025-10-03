import React from 'react';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = "" }) => {
  const { open, collapsed, expanded } = useSidebar();

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'w-16' : expanded ? 'w-64' : 'w-20'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Sidebar;
