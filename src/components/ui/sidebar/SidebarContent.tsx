
import React from 'react';

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex-1 overflow-auto ${className}`}>
      {children}
    </div>
  );
};

export default SidebarContent;
