
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export interface NavItemProps {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ path, icon, label }: NavItemProps) => {
  return (
    <NavLink to={path}>
      {({isActive}) => (
        <NavigationMenuLink 
          className={cn(
            navigationMenuTriggerStyle(),
            isActive ? "bg-primary text-primary-foreground font-medium border-b-2 border-primary" : "hover:bg-accent hover:text-accent-foreground",
            "flex items-center transition-all duration-200"
          )}
        >
          {icon}
          {label}
        </NavigationMenuLink>
      )}
    </NavLink>
  );
};

export default NavItem;
