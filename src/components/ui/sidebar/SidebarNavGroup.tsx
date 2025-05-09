
import React from 'react';
import NavItemButton from './NavItemButton';

// Export the interface so it can be imported elsewhere
export interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
}

interface SidebarNavGroupProps {
  title: string;
  items: NavItemConfig[];
  collapsed: boolean;
}

const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({ title, items, collapsed }) => {
  return (
    <>
      <div className="px-3 mb-2">
        <h2 className={`text-sm font-medium text-muted-foreground ${collapsed ? 'sr-only' : ''}`}>
          {title}
        </h2>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <NavItemButton
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </div>
    </>
  );
};

export default SidebarNavGroup;
