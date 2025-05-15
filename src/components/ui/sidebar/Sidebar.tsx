
import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-background border-r w-64 h-screen overflow-y-auto flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export default Sidebar;
