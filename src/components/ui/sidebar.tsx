
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { navItems, adminNavItems, footerNavItems } from '@/components/navigation/navConfig';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bell, Settings } from 'lucide-react';
import { isAdminRole } from '@/utils/roleUtils';
import NotificationBar from '@/components/notifications/NotificationBar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = isAdminRole(user?.role);
  
  // Choisir les éléments de navigation en fonction du rôle
  const items = isAdmin ? adminNavItems : navItems;
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <aside 
      className={`bg-background/80 backdrop-blur-sm border-r border-border transition-all duration-300 flex flex-col h-full fixed left-0 top-16 bottom-0 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      aria-label="Sidebar navigation"
    >
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {items.map((item) => (
            collapsed ? (
              <TooltipProvider key={item.path}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      size="icon"
                      className="w-full h-10"
                      onClick={() => handleNavigation(item.path)}
                    >
                      {React.cloneElement(item.icon, { className: "h-5 w-5" })}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className="w-full justify-start px-3"
                onClick={() => handleNavigation(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            )
          ))}
        </div>

        {!isAdmin && footerNavItems.length > 0 && (
          <>
            <div className="my-2 border-t border-border"></div>
            <div className="space-y-1">
              {footerNavItems.map((item) => (
                collapsed ? (
                  <TooltipProvider key={item.path}>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive(item.path) ? "secondary" : "ghost"}
                          size="icon"
                          className="w-full h-10"
                          onClick={() => handleNavigation(item.path)}
                        >
                          {React.cloneElement(item.icon, { className: "h-5 w-5" })}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className="w-full justify-start px-3"
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                )
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Notification et contrôle d'affichage */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center justify-between mb-2 px-2">
          {!collapsed && (
            <span className="text-xs text-muted-foreground">Notifications</span>
          )}
          
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center py-2">
                    <NotificationBar userId={user?.id} unreadCount={3} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Notifications
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <NotificationBar userId={user?.id} unreadCount={3} />
          )}
        </div>
        
        <Button 
          variant="outline" 
          size={collapsed ? "icon" : "sm"}
          className={`${collapsed ? '' : 'w-full justify-between'}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {!collapsed && <span className="text-xs">Réduire</span>}
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
