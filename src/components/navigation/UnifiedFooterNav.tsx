
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { commonNavItems } from './navConfig';
import { cn } from '@/lib/utils';

interface UnifiedFooterNavProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedFooterNav: React.FC<UnifiedFooterNavProps> = ({ 
  collapsed = false, 
  onItemClick 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleItemClick = (href: string) => {
    navigate(href);
    onItemClick?.();
  };

  return (
    <nav className="space-y-2">
      {commonNavItems.map((item) => {
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
              <span className="truncate">{item.title}</span>
            )}
          </Button>
        );
      })}
    </nav>
  );
};

export default UnifiedFooterNav;
