
import React from 'react';

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, className = "" }) => {
  return (
    <nav className={`space-y-1 ${className}`}>
      {children}
    </nav>
  );
};

export default SidebarMenu;
