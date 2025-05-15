
import React from 'react';

interface SidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  children, 
  className = "", 
  active = false 
}) => {
  return (
    <li className={`list-none ${active ? 'text-primary' : 'text-foreground'} ${className}`}>
      {children}
    </li>
  );
};

export default SidebarMenuItem;
