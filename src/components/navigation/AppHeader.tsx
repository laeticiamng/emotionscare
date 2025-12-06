// @ts-nocheck
import React, { useState } from 'react';
import { Bell, Search, Menu, Sun, Moon, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface AppHeaderProps {
  onNotificationsToggle: () => void;
  notificationsOpen: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onNotificationsToggle, notificationsOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { theme, setTheme } = useTheme();
  const [notificationCount] = useState(3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      toast.info(`Recherche : "${searchValue}"`);
      // Ici on pourrait implémenter une vraie recherche
    }
    setSearchOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      toast.success('Mode plein écran activé');
    } else {
      document.exitFullscreen();
      toast.success('Mode plein écran désactivé');
    }
  };

  const quickActions = [
    { label: 'Scan rapide', action: () => window.location.href = '/app/scan' },
    { label: 'Flash Glow', action: () => window.location.href = '/app/flash-glow' },
    { label: 'Respiration', action: () => window.location.href = '/app/breath' },
    { label: 'Journal', action: () => window.location.href = '/app/journal' }
  ];

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 relative z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="flex items-center"
              >
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Rechercher modules, actions..."
                  className="w-full"
                  autoFocus
                  onBlur={() => {
                    if (!searchValue) setSearchOpen(false);
                  }}
                />
              </motion.form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="h-8 w-8"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.action}
              className="text-xs"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-8 w-8"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="h-8 w-8 hidden md:flex"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationsToggle}
          className={`h-8 w-8 relative ${notificationsOpen ? 'bg-muted' : ''}`}
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* Menu Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {searchOpen && searchValue && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-20 right-4 bg-card border rounded-lg shadow-lg p-2 mt-1 z-50"
          >
            <div className="text-sm text-muted-foreground mb-2">Suggestions rapides</div>
            <div className="space-y-1">
              {quickActions
                .filter(action => action.label.toLowerCase().includes(searchValue.toLowerCase()))
                .map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full text-left p-2 rounded hover:bg-muted transition-colors text-sm"
                  >
                    {action.label}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export { AppHeader };