
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { X, Menu, Home, Settings, Bell, User, Moon, Sun, Users, BookOpen, Music, MessageCircle, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = "" }) => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    if (logout) {
      await logout();
      setOpen(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const menuItems = [
    { href: '/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: '/emotions', label: 'Émotions', icon: <Home className="mr-2 h-4 w-4" /> },
    { href: '/music', label: 'Musicothérapie', icon: <Music className="mr-2 h-4 w-4" /> },
    { href: '/coach', label: 'Coach IA', icon: <MessageCircle className="mr-2 h-4 w-4" /> },
    { href: '/journal', label: 'Journal', icon: <BookOpen className="mr-2 h-4 w-4" /> },
    { href: '/community', label: 'Communauté', icon: <Users className="mr-2 h-4 w-4" /> },
    { href: '/profile', label: 'Profil', icon: <User className="mr-2 h-4 w-4" /> },
    { href: '/settings', label: 'Paramètres', icon: <Settings className="mr-2 h-4 w-4" /> },
  ];

  return (
    <div className={className}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Menu">
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[80%] max-w-sm p-0 bg-background">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b">
              <div className="flex justify-between items-center">
                <SheetTitle>
                  <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">EC</span>
                    </div>
                    <span className="ml-2 font-semibold text-xl">EmotionsCare</span>
                  </Link>
                </SheetTitle>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SheetDescription>
                {user ? `Bonjour, ${user.name}` : 'Menu de navigation'}
              </SheetDescription>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                        location.pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Thème</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
              
              {isAuthenticated ? (
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Se connecter</Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button variant="default" className="w-full">S'inscrire</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
