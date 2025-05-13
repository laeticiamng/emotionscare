
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { sidebarItems, adminSidebarItems } from './navConfig';
import { useUserMode } from '@/contexts/UserModeContext';
import { isAdminRole } from '@/utils/roleUtils';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemType {
  title: string;
  href: string;
  icon: React.ElementType;
  b2cOnly?: boolean;
  b2bOnly?: boolean;
}

interface SidebarNavProps {
  className?: string;
  onNavItemClick?: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className, onNavItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  const { user } = useAuth();
  
  const isB2C = userMode === 'personal' || userMode === 'b2c';
  const isAdmin = user?.role && isAdminRole(user.role);
  
  // Sélectionner les bons éléments de navigation selon le mode utilisateur
  const navItems = isAdmin ? adminSidebarItems : sidebarItems;
  
  // Filtrer les éléments en fonction du mode utilisateur
  const filteredNavItems = navItems.filter(item => {
    // Si l'élément est marqué b2cOnly, ne l'afficher qu'en mode B2C
    if ((item as NavItemType).b2cOnly && !isB2C) return false;
    
    // Si l'élément est marqué b2bOnly, ne l'afficher qu'en mode B2B
    if ((item as NavItemType).b2bOnly && isB2C) return false;
    
    return true;
  });

  const handleClick = (href: string) => {
    navigate(href);
    if (onNavItemClick) {
      onNavItemClick();
    }
  };

  return (
    <ScrollArea className={cn("pr-1 py-2", className)}>
      <div className="space-y-1">
        {filteredNavItems.map((item) => (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              location.pathname === item.href ? "bg-secondary" : ""
            )}
            onClick={() => handleClick(item.href)}
          >
            {item.icon && <item.icon className="mr-2 h-5 w-5" />}
            {item.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SidebarNav;
