import React from 'react';

interface SidebarGroupLabelProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({ children, className = "" }) => {
  return (
    <h3 className={`px-3 mb-2 text-xs uppercase font-medium text-muted-foreground tracking-wider ${className}`}>
      {children}
    </h3>
  );
};

export default SidebarGroupLabel;
