import React from 'react';

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, className = "" }) => {
  return (
    <div className={`p-4 border-b ${className}`}>
      {children}
    </div>
  );
};

export default SidebarHeader;
