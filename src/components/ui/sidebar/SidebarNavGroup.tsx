
import React from 'react';
import { useSidebar } from './SidebarContext';
import NavItemButton from './NavItemButton';

interface SidebarNavGroupProps {
  title: string;
  items: Array<{
    path: string;
    label: string;
    icon: React.ElementType;
  }>;
  collapsed: boolean;
}

const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({ title, items, collapsed }) => {
  const { collapsed: sidebarCollapsed } = useSidebar();
  
  console.log(`Rendering SidebarNavGroup: ${title}, Items:`, items.map(i => i.label), "Collapsed:", collapsed);

  return (
    <div className="space-y-1">
      {!sidebarCollapsed && (
        <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
          {title}
        </h2>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <NavItemButton
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
            collapsed={sidebarCollapsed}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarNavGroup;
