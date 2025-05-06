
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { topNavItems, adminTopNavItems } from './navigation/navConfig';
import { isAdminRole } from '@/utils/roleUtils';

import Logo from './navigation/Logo';
import DesktopNavigation from './navigation/DesktopNavigation';
import UserMenu from './navigation/UserMenu';
import MobileNavigation from './navigation/MobileNavigation';

const GlobalNav = () => {
  const { user } = useAuth();
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  // Sélectionner les bons éléments de navigation en fonction du rôle
  const navigationItems = isAdmin ? adminTopNavItems : topNavItems;
  
  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - cliquable pour revenir au dashboard */}
        <Logo isAdmin={isAdmin} />
        
        {/* Desktop Navigation */}
        <DesktopNavigation navigationItems={navigationItems} />
        
        {/* User Profile - Desktop */}
        <UserMenu badgesCount={0} />
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </header>
  );
};

export default GlobalNav;
