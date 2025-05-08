
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Music, LogOut, Sun, Moon, CloudSun } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { sidebarItems, adminSidebarItems } from './navConfig';
import { isAdminRole } from '@/utils/roleUtils';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { openDrawer } = useMusic();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user ? isAdminRole(user.role) : false;

  // Define navigation items directly from the sidebar config
  const navigationItems = isAdmin ? adminSidebarItems : sidebarItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Moon className="w-4 h-4 mr-2" />;
      case 'dark':
        return <CloudSun className="w-4 h-4 mr-2" />;
      case 'pastel':
        return <Sun className="w-4 h-4 mr-2 text-amber-500" />;
      default:
        return <Moon className="w-4 h-4 mr-2" />;
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return 'Passer au mode sombre';
      case 'dark':
        return 'Passer au mode pastel';
      case 'pastel':
        return 'Passer au mode clair';
      default:
        return 'Changer de thème';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Menu"
          className="focus:ring-0"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[320px] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b">
            <NavLink to="/dashboard" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <span className="font-bold text-lg text-primary">{isAdmin ? "EC Admin" : "EmotionsCare"}</span>
            </NavLink>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le menu"
              className="focus:ring-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-1">
            {user && (
              <div className="flex items-center gap-3 p-3 mb-2 mx-2 bg-muted/50 rounded-lg">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
            )}
            
            <nav className="flex flex-col space-y-0 px-2">
              {navigationItems.map((item, index) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                return (
                  <React.Fragment key={item.href}>
                    {index === 0 || index === Math.floor(navigationItems.length / 2) ? (
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mt-3 mb-1">
                        {index === 0 ? 'Navigation principale' : 'Outils complémentaires'}
                      </div>
                    ) : null}
                    <NavLink
                      to={item.href}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md transition-colors text-sm",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {React.createElement(item.icon, { className: "w-4 h-4 mr-2" })}
                      <span>{item.title}</span>
                    </NavLink>
                  </React.Fragment>
                );
              })}
              
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mt-3 mb-1">
                Thème
              </div>
              <button 
                className="flex items-center py-2 px-3 rounded-md transition-colors hover:bg-accent/50 w-full text-left text-sm"
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
              >
                {getThemeIcon()}
                <span>{getThemeText()}</span>
              </button>
              
              {!isAdmin && (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mt-3 mb-1">
                    Extras
                  </div>
                  <button 
                    className="flex items-center py-2 px-3 rounded-md transition-colors hover:bg-accent/50 w-full text-left text-sm"
                    onClick={() => {
                      openDrawer();
                      setIsOpen(false);
                    }}
                  >
                    <Music className="w-4 h-4 mr-2" />
                    <span>Soundtrack du bien-être</span>
                  </button>
                </>
              )}
            </nav>
          </div>
          
          <div className="p-3 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground hover:text-destructive text-sm" 
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              <LogOut size={16} className="mr-2" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
