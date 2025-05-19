
import React, { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Music, MessageCircle, Users, LayoutDashboard, Settings,
  Bell, Search, Command, User, Sun, Moon, Menu, X 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedHeaderProps {
  scrolled?: boolean;
  className?: string;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ scrolled = false, className }) => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Navigation items with icons
  const navigationItems = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" />, label: "Dashboard" },
    { to: "/emotions", icon: <Home className="h-4 w-4 mr-2" />, label: "Émotions" },
    { to: "/music", icon: <Music className="h-4 w-4 mr-2" />, label: "Music" },
    { to: "/coach", icon: <MessageCircle className="h-4 w-4 mr-2" />, label: "Coach" },
    { to: "/community", icon: <Users className="h-4 w-4 mr-2" />, label: "Communauté" },
    { to: "/settings", icon: <Settings className="h-4 w-4 mr-2" />, label: "Paramètres" }
  ];

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "h-16 bg-background/80 backdrop-blur-lg shadow-sm"
          : "h-20 bg-transparent",
        className
      )}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo & Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">EC</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hidden sm:inline-block"
            >
              EmotionsCare
            </motion.span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <AnimatePresence mode="wait">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "relative px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center",
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                )}
              >
                {({ isActive }) => (
                  <>
                    {item.icon}
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", duration: 0.4 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </AnimatePresence>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Recherche">
                <Search className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogTitle>Recherche</DialogTitle>
              <div className="flex items-center border rounded-md px-3 py-2 mt-4">
                <Search size={16} className="text-muted-foreground mr-2" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  className="border-0 p-0 shadow-none focus-visible:ring-0"
                />
                <div className="text-xs text-muted-foreground ml-auto">
                  <kbd className="rounded border px-1">⌘</kbd>
                  <kbd className="rounded border px-1 ml-1">K</kbd>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Passer au thème clair" : "Passer au thème sombre"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu or Profile Button */}
          {isAuthenticated ? (
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.avatar} alt={user?.name || 'Utilisateur'} />
              <AvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80%] max-w-xs">
              <SheetHeader>
                <SheetTitle>EmotionsCare</SheetTitle>
              </SheetHeader>
              <nav className="mt-6">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => cn(
                          "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
