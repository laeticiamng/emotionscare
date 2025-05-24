
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { b2cNavItems, b2bUserNavItems, b2bAdminNavItems } from './navConfig';
import { cn } from '@/lib/utils';

interface UnifiedNavigationProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ 
  collapsed = false, 
  onItemClick 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  if (!isAuthenticated || !user) {
    return null;
  }

  const getNavItems = () => {
    switch (userMode) {
      case 'b2b_admin':
        return b2bAdminNavItems;
      case 'b2b_user':
        return b2bUserNavItems;
      default:
        return b2cNavItems;
    }
  };

  const navItems = getNavItems();

  const handleItemClick = (href: string) => {
    navigate(href);
    onItemClick?.();
  };

  return (
    <nav className="space-y-2 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              collapsed && "px-2",
              isActive && "bg-secondary text-secondary-foreground"
            )}
            onClick={() => handleItemClick(item.href)}
          >
            <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
            )}
          </Button>
        );
      })}
    </nav>
  );
};

export default UnifiedNavigation;
