
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavItem from './NavItem';
import { b2cNavItems, b2bUserNavItems, b2bAdminNavItems } from './navConfig';

interface UnifiedNavigationProps {
  onItemClick?: () => void;
  collapsed?: boolean;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ 
  onItemClick,
  collapsed = false 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Déterminer les éléments de navigation selon le rôle
  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'b2b_admin':
        return b2bAdminNavItems;
      case 'b2b_user':
        return b2bUserNavItems;
      case 'b2c':
      default:
        return b2cNavItems;
    }
  };
  
  const navItems = getNavItems();
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.title}
          icon={<item.icon className="h-5 w-5" />}
          isActive={location.pathname === item.href}
          onClick={onItemClick}
          className={collapsed ? "justify-center px-2" : ""}
        />
      ))}
    </nav>
  );
};

export default UnifiedNavigation;
