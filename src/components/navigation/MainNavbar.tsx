
import React, { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Fix incorrect import
import ThemeSelector from '@/components/theme/ThemeSelector';
import AudioControls from '@/components/audio/AudioControls';
import UserMenu from './UserMenu';
import GuestMenu from './GuestMenu';
import MobileNavigation from './MobileNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Home, Music, MessageCircle, Users, LayoutDashboard, Settings } from 'lucide-react';

const MainNavbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Menu items with icons
  const navigationItems = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" />, label: "Dashboard" },
    { to: "/emotions", icon: <Home className="h-4 w-4 mr-2" />, label: "Émotions" },
    { to: "/music", icon: <Music className="h-4 w-4 mr-2" />, label: "Music" },
    { to: "/coach", icon: <MessageCircle className="h-4 w-4 mr-2" />, label: "Coach" },
    { to: "/community", icon: <Users className="h-4 w-4 mr-2" />, label: "Communauté" },
    { to: "/settings", icon: <Settings className="h-4 w-4 mr-2" />, label: "Paramètres" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <div className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "bg-background/80 backdrop-blur-lg shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
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
        <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
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
        
        {/* Right Menu Controls */}
        <div className="flex items-center space-x-2">
          <AudioControls minimal className="mr-2 hidden sm:flex" />
          <ThemeSelector minimal className="mr-2" />
          
          {/* User Menu or Guest Menu */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isAuthenticated ? 'user' : 'guest'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {isAuthenticated ? <UserMenu /> : <GuestMenu />}
            </motion.div>
          </AnimatePresence>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNavigation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
