
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  BookOpen,
  Music,
  Activity,
  MessageSquare,
  HeadphonesIcon,
  Award,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`w-full justify-start mb-1 ${
          isActive ? "bg-primary/10 text-primary" : ""
        }`}
      >
        {icon}
        <span className="ml-2">{label}</span>
        {isActive && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
            layoutId="activeNavIndicator"
          />
        )}
      </Button>
    </Link>
  );
};

export default function B2CNavBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const navItems = [
    { to: '/b2c/dashboard', icon: <Home className="h-5 w-5" />, label: 'Accueil' },
    { to: '/b2c/journal', icon: <BookOpen className="h-5 w-5" />, label: 'Journal' },
    { to: '/b2c/music', icon: <Music className="h-5 w-5" />, label: 'Musique' },
    { to: '/b2c/scan', icon: <Activity className="h-5 w-5" />, label: 'Scan' },
    { to: '/b2c/coach', icon: <MessageSquare className="h-5 w-5" />, label: 'Coach' },
    { to: '/b2c/vr', icon: <HeadphonesIcon className="h-5 w-5" />, label: 'VR' },
    { to: '/b2c/gamification', icon: <Award className="h-5 w-5" />, label: 'Récompenses' },
    { to: '/b2c/preferences', icon: <Settings className="h-5 w-5" />, label: 'Préférences' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // Find active route for highlighting
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const variants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    closed: { 
      x: '-100%',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }
  };

  const mobileNav = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleMenu}
        >
          <motion.div
            className="absolute top-0 left-0 bottom-0 w-64 bg-background"
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">EmotionsCare</h2>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-64px)] p-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive(item.to)}
                    onClick={toggleMenu}
                  />
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const desktopNav = (
    <motion.div
      className="h-screen overflow-auto py-6 px-3 border-r border-border bg-background/80 backdrop-blur-md"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <div className="px-3 py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">EmotionsCare</h2>
          <p className="text-xs text-muted-foreground mb-6">Votre espace de bien-être</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.to)}
            />
          ))}
        </nav>
      </div>
    </motion.div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <div className="fixed top-0 left-0 right-0 h-14 border-b bg-background/80 backdrop-blur-md z-40 px-4 flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="ml-2 font-medium">EmotionsCare</span>
          </div>
          {mobileNav}
        </>
      ) : (
        desktopNav
      )}
    </>
  );
}
