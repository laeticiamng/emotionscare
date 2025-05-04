
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
import { navItems } from './navigation/navConfig';

const GlobalNav = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - cliquable pour revenir au dashboard */}
        <NavLink to="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-lg text-primary">EmotionsCare</span>
          <span className="text-xs text-muted-foreground">par ResiMax™ 4.0</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavItem path={item.path} icon={item.icon} label={item.label} />
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        
        {/* User Profile and Music Button - Desktop */}
        <UserMenu />
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </header>
  );
};

export default GlobalNav;
