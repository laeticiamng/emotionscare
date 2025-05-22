
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemButtonProps {
  path: string;
  icon: React.ElementType;
  label: string;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItemButton: React.FC<NavItemButtonProps> = ({ 
  path, 
  icon, 
  label, 
  collapsed = false,
  onClick
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const handleNavigation = () => {
    navigate(path);
    if (onClick) onClick();
  };

  const Icon = icon;
  
  // Version avec tooltip lorsque la barre latérale est réduite
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            className="w-full h-10 my-1"
            onClick={handleNavigation}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="z-50">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Version étendue
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start px-3 my-1"
      onClick={handleNavigation}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Button>
  );
};

export default NavItemButton;
