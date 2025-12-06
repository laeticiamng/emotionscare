// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Bell, User, Menu, X, Command, Settings, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useTheme } from '@/providers/theme';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import MusicMiniPlayer from '@/components/music/MusicMiniPlayer';

interface PremiumHeaderProps {
  className?: string;
  onOpenMenu?: () => void;
  onCloseMenu?: () => void;
  isMenuOpen?: boolean;
}

const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  className,
  onOpenMenu,
  onCloseMenu,
  isMenuOpen = false
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const { scrollY } = useScroll();
  
  const headerBgOpacity = useTransform(scrollY, [0, 50], [0.5, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 12]);
  const headerShadowOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    if (isMenuOpen && onCloseMenu) {
      onCloseMenu();
    } else if (!isMenuOpen && onOpenMenu) {
      onOpenMenu();
    }
  };
  
  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-2",
        scrolled ? "py-2" : "py-4",
        isDarkMode ? "text-white" : "text-gray-800",
        className
      )}
      style={{
        backgroundColor: isDarkMode 
          ? `rgba(15, 23, 42, ${headerBgOpacity})` 
          : `rgba(255, 255, 255, ${headerBgOpacity})`,
        backdropFilter: `blur(${headerBlur}px)`,
        boxShadow: `0 4px 6px rgba(0, 0, 0, ${headerShadowOpacity})`
      }}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-2 lg:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          <motion.div 
            className="text-xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            EmotionsCare
          </motion.div>
        </div>
        
        {/* Central Navigation - Desktop Only */}
        <nav className="hidden lg:flex items-center space-x-1">
          {["Accueil", "Dashboard", "Coach", "Musique", "Scanner", "Social"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Button variant="ghost" className="px-3">
                {item}
              </Button>
            </motion.div>
          ))}
        </nav>
        
        {/* Right Controls */}
        <div className="flex items-center space-x-1">
          {/* Search */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Rechercher">
                <Search size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="flex items-center border rounded-md px-3 py-2">
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
          
          {/* Quick Command Menu */}
          <Button variant="ghost" size="icon" aria-label="Menu de commandes">
            <Command size={20} />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell size={20} />
          </Button>
          
          {/* Theme Switcher */}
          <ThemeSwitcher size="icon" />
          
          {/* Mini Music Player */}
          <div className="hidden sm:block">
            <MusicMiniPlayer className="ml-2" />
          </div>
          
          {/* User Profile */}
          <Button variant="ghost" size="icon" className="ml-2" aria-label="Profil utilisateur">
            <User size={20} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default PremiumHeader;
