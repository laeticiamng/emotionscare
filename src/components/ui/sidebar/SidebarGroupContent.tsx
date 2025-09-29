
import React from 'react';

interface SidebarGroupContentProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarGroupContent: React.FC<SidebarGroupContentProps> = ({ children, className = "" }) => {
  return (
    <div className={`px-3 ${className}`}>
      {children}
    </div>
  );
};

export default SidebarGroupContent;
