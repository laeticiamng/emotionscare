
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavItem from './NavItem';

interface DesktopNavigationProps {
  navigationItems: Array<{
    path: string;
    label: string;
    icon: React.ReactElement;
    roles?: string[];
  }>;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ navigationItems }) => {
  return (
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
  );
};

export default DesktopNavigation;
