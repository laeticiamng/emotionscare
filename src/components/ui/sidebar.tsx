
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { navItems, adminNavItems } from '@/components/navigation/navConfig';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bell, Settings } from 'lucide-react';
import { isAdminRole } from '@/utils/roleUtils';
import NotificationBar from '@/components/notifications/NotificationBar';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = isAdminRole(user?.role);
  
  // Choose navigation items based on user role
  const items = isAdmin ? adminNavItems : navItems;
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div 
      className={`bg-secondary/10 border-r border-border transition-all duration-300 flex flex-col h-full fixed left-0 top-16 bottom-0 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {items.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className={`w-full justify-start ${collapsed ? 'px-2' : 'px-3'}`}
              onClick={() => handleNavigation(item.href)}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Button>
          ))}

          {!isAdmin && (
            <>
              <div className="my-2 border-t border-border"></div>
              <Button
                variant={isActive("/my-data") ? "secondary" : "ghost"}
                className={`w-full justify-start ${collapsed ? 'px-2' : 'px-3'}`}
                onClick={() => handleNavigation('/my-data')}
              >
                <Settings size={18} />
                {!collapsed && <span className="ml-3">Mes Données</span>}
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="p-2 border-t border-border">
        {!collapsed && (
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs text-muted-foreground">Notifications</span>
            <NotificationBar userId={user?.id} unreadCount={3} />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <NotificationBar userId={user?.id} unreadCount={3} />
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="self-end m-2"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </Button>
    </div>
  );
};

export default Sidebar;
