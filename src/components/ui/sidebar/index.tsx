
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sidebarItems, adminSidebarItems, footerNavItems } from '@/components/navigation/navConfig';
import { isAdminRole } from '@/utils/roleUtils';
import { SidebarProvider, useSidebar } from './SidebarContext';
import SidebarNavGroup from './SidebarNavGroup';
import SidebarFooter from './SidebarFooter';
import ThemeButton from './ThemeButton';

// Interface to ensure compatibility with NavItemConfig
interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ElementType;
  [key: string]: any;
}

// Function to convert NavItem to NavItemConfig
const convertToNavItemConfig = (items: any[]) => {
  return items.map(item => ({
    path: item.href || "",
    label: item.title || "",
    icon: item.icon,
    ...item
  }));
};

// Inner component that uses the sidebar context
const SidebarContent: React.FC = () => {
  const { user } = useAuth();
  const { collapsed } = useSidebar();
  const isAdmin = isAdminRole(user?.role);
  
  console.log("Rendering Sidebar with user:", user?.name, "isAdmin:", isAdmin, "collapsed:", collapsed);
  
  // Choisir les éléments de navigation en fonction du rôle
  const items = isAdmin ? adminSidebarItems : sidebarItems;
  const configItems = convertToNavItemConfig(items);
  const configFooterItems = convertToNavItemConfig(footerNavItems);

  return (
    <aside 
      className={`bg-background/80 backdrop-blur-sm border-r border-border transition-all duration-300 flex flex-col h-full fixed left-0 top-16 bottom-0 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      aria-label="Sidebar navigation"
    >
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <SidebarNavGroup
          title={isAdmin ? 'Outils Administrateur' : 'Outils Complémentaires'}
          items={configItems}
          collapsed={collapsed}
        />

        {!isAdmin && footerNavItems.length > 0 && (
          <>
            <div className="my-2 border-t border-border"></div>
            <SidebarNavGroup
              title="Préférences"
              items={configFooterItems}
              collapsed={collapsed}
            />
            
            {/* Bouton de basculement de thème */}
            <div className="space-y-1 mt-2">
              <ThemeButton collapsed={collapsed} />
            </div>
          </>
        )}
      </div>
      
      <SidebarFooter />
    </aside>
  );
};

// Export the main Sidebar component that provides the context
const Sidebar: React.FC = () => {
  console.log("Rendering Sidebar component");
  return (
    <SidebarProvider>
      <SidebarContent />
    </SidebarProvider>
  );
};

export default Sidebar;
