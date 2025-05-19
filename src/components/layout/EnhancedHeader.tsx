
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  Settings, 
  Home, 
  Music, 
  MessageCircle, 
  Users,
  Moon,
  Sun,
  Command
} from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import MusicMiniPlayer from '../music/MusicMiniPlayer';

interface EnhancedHeaderProps {
  scrolled: boolean;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ scrolled }) => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Items de navigation avec icônes
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/emotions", label: "Émotions", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/music", label: "Musique", icon: <Music className="h-4 w-4 mr-2" /> },
    { href: "/coach", label: "Coach", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
    { href: "/community", label: "Communauté", icon: <Users className="h-4 w-4 mr-2" /> },
    { href: "/settings", label: "Paramètres", icon: <Settings className="h-4 w-4 mr-2" /> }
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-lg py-2 shadow-sm" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">EC</span>
            </motion.div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hidden sm:inline-block">
              EmotionsCare
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <AnimatePresence mode="wait">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
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

        {/* Right Side Controls */}
        <div className="flex items-center space-x-1">
          {/* Mini Music Player */}
          <div className="hidden sm:block">
            <MusicMiniPlayer className="mr-2" />
          </div>
          
          {/* Command Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            aria-label="Command Menu"
          >
            <Command className="h-5 w-5" />
            <span className="sr-only">Command Menu</span>
          </Button>
          
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.div>
            </AnimatePresence>
            <span className="sr-only">
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </span>
          </Button>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">EC</span>
                        </div>
                        <span className="text-xl font-semibold">EmotionsCare</span>
                      </Link>
                    </div>
                  </div>
                  
                  <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                      {navItems.map((item) => (
                        <li key={item.href}>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) => cn(
                              "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                              isActive 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            {item.icon}
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  
                  <div className="border-t p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Thème</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label={isDarkMode ? "Mode clair" : "Mode sombre"}
                      >
                        {isDarkMode ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <MusicMiniPlayer className="mt-4" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
