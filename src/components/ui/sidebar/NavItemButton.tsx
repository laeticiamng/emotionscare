
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface NavItemButtonProps {
  path: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const NavItemButton: React.FC<NavItemButtonProps> = ({ path, icon, label, collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = useCallback((path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  }, [location.pathname]);

  const handleNavigation = useCallback(() => {
    console.log(`Navigation to: ${path}`);
    navigate(path);
  }, [path, navigate]);

  const Icon = icon;
  
  // Ajout de debug pour vérifier si le bouton reçoit correctement les props
  console.log(`Rendering NavItemButton: ${label}, Path: ${path}, Active: ${isActive(path)}, Collapsed: ${collapsed}`);

  // Version avec tooltip lorsque la barre latérale est réduite
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isActive(path) ? "secondary" : "ghost"}
              size="icon"
              className="w-full h-10 my-1"
              onClick={handleNavigation}
              aria-current={isActive(path) ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="z-50">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Version étendue
  return (
    <Button
      variant={isActive(path) ? "secondary" : "ghost"}
      className="w-full justify-start px-3 my-1"
      onClick={handleNavigation}
      aria-current={isActive(path) ? "page" : undefined}
    >
      <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Button>
  );
};

export default NavItemButton;
