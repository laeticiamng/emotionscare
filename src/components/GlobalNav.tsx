
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavItem from './navigation/NavItem';
import UserMenu from './navigation/UserMenu';
import MobileNavigation from './navigation/MobileNavigation';
import { topNavItems, adminTopNavItems } from './navigation/navConfig';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';

const GlobalNav = () => {
  const { user } = useAuth();
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  // Sélectionner les bons éléments de navigation en fonction du rôle
  const navigationItems = isAdmin ? adminTopNavItems : topNavItems;
  
  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - cliquable pour revenir au dashboard */}
        <NavLink to="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-lg text-primary">{isAdmin ? "EmotionsCare Admin" : "EmotionsCare"}</span>
          <span className="text-xs text-muted-foreground">par ResiMax™ 4.0</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavItem 
                    icon={item.icon} 
                    label={item.label} 
                    to={item.path} 
                  />
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        
        {/* User Profile - Desktop */}
        <UserMenu badgesCount={0} />
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </header>
  );
};

export default GlobalNav;
