
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Music, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { topNavItems, sidebarItems, adminTopNavItems, adminSidebarItems } from './navConfig';
import { isAdminRole } from '@/utils/roleUtils';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { openDrawer } = useMusic();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user ? isAdminRole(user.role) : false;

  // Regrouper les items de navigation
  const topItems = isAdmin ? adminTopNavItems : topNavItems;
  const sideItems = isAdmin ? adminSidebarItems : sidebarItems;
  
  // Combiner les deux pour le menu mobile, avec des séparateurs visuels
  const allNavigationItems = [
    ...topItems.map(item => ({ ...item, section: 'principal' })),
    ...sideItems.map(item => ({ ...item, section: 'outils' }))
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderSectionHeader = (section: string, index: number) => {
    const prevItem = index > 0 ? allNavigationItems[index - 1] : null;
    if (index === 0 || (prevItem && prevItem.section !== section)) {
      return (
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mt-3 mb-1">
          {section === 'principal' ? 'Navigation principale' : 'Outils complémentaires'}
        </div>
      );
    }
    return null;
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
              {allNavigationItems.map((item, index) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <React.Fragment key={item.path}>
                    {renderSectionHeader(item.section, index)}
                    <NavLink
                      to={item.path}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md transition-colors text-sm",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {React.cloneElement(item.icon, { className: "w-4 h-4 mr-2" })}
                      <span>{item.label}</span>
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
                {isDark ? 
                  <Sun className="w-4 h-4 mr-2 text-amber-500" /> : 
                  <Moon className="w-4 h-4 mr-2" />
                }
                <span>{isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}</span>
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
