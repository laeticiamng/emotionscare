
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Music, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import { navItems } from './navConfig';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { openDrawer } = useMusic();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="px-2">
          <div className="flex items-center justify-between mb-6">
            <NavLink to="/dashboard" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <span className="font-bold text-xl text-primary">EmotionsCare</span>
            </NavLink>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {user && (
            <div className="flex items-center gap-3 p-4 mb-4 bg-muted/50 rounded-lg">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
          )}
          
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium border-l-4 border-primary"
                      : "hover:bg-accent/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            
            <button 
              className="flex items-center py-2 px-3 rounded-md transition-colors hover:bg-accent/50"
              onClick={() => {
                openDrawer();
                setIsOpen(false);
              }}
            >
              <Music className="w-5 h-5 mr-2" />
              <span>Soundtrack du bien-être</span>
            </button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive mt-4" 
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              aria-label="Déconnexion"
            >
              <LogOut size={18} className="mr-2" />
              <span>Déconnexion</span>
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
