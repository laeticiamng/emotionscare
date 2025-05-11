
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemButtonProps {
  path: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const NavItemButton: React.FC<NavItemButtonProps> = ({ path, icon, label, collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const handleNavigation = () => {
    console.log(`Navigation to: ${path}`);
    navigate(path);
  };

  const Icon = icon;

  // Collapsed version with tooltip
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive(path) ? "secondary" : "ghost"}
            size="icon"
            className="w-full h-10"
            onClick={handleNavigation}
          >
            <Icon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Expanded version
  return (
    <Button
      variant={isActive(path) ? "secondary" : "ghost"}
      className="w-full justify-start px-3"
      onClick={handleNavigation}
    >
      <Icon className="h-5 w-5" />
      <span className="ml-2">{label}</span>
    </Button>
  );
};

export default NavItemButton;
