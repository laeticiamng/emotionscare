
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sidebarItems, adminSidebarItems, footerNavItems } from '@/components/navigation/navConfig';
import { isAdminRole } from '@/utils/roleUtils';
import { SidebarProvider, useSidebar } from './SidebarContext';
import SidebarNavGroup from './SidebarNavGroup';
import SidebarFooter from './SidebarFooter';
import ThemeButton from './ThemeButton';

// Interface pour assurer la compatibilité avec NavItemConfig
interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ElementType;
  [key: string]: any;
}

// Fonction pour convertir NavItem en NavItemConfig
const convertToNavItemConfig = (items: any[]) => {
  return items.map(item => ({
    path: item.href || "",
    label: item.title || "",
    icon: item.icon,
    ...item
  }));
};

// Composant interne qui utilise le contexte sidebar
const SidebarContent: React.FC = () => {
  const { user } = useAuth();
  const { collapsed } = useSidebar();
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  console.log("Rendering Sidebar with user:", user?.name, "isAdmin:", isAdmin, "collapsed:", collapsed);
  
  // Choisir les éléments de navigation en fonction du rôle
  const items = isAdmin ? adminSidebarItems : sidebarItems;
  const configItems = convertToNavItemConfig(items);
  const configFooterItems = convertToNavItemConfig(footerNavItems);

  return (
    <aside 
      className={`bg-background/80 backdrop-blur-sm border-r border-border h-full flex flex-col transition-all duration-300 ${
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

// Exporter le composant Sidebar principal qui fournit le contexte
const Sidebar: React.FC = () => {
  console.log("Rendering Sidebar component");
  return (
    <SidebarProvider>
      <SidebarContent />
    </SidebarProvider>
  );
};

export default Sidebar;
