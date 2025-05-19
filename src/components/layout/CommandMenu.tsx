
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Music,
  MessageCircle,
  Users,
  Settings,
  Search,
  User,
  LogOut,
  Heart,
  BarChart,
  Bell,
  X,
  Calendar,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme/ThemeProvider';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'user' | 'system';
}

const CommandMenu: React.FC<CommandMenuProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  
  const commandItems: CommandItem[] = [
    // Navigation items
    {
      id: 'home',
      icon: <Home className="h-4 w-4" />,
      label: 'Accueil',
      shortcut: '⌘H',
      action: () => navigate('/'),
      category: 'navigation'
    },
    {
      id: 'dashboard',
      icon: <BarChart className="h-4 w-4" />,
      label: 'Tableau de bord',
      shortcut: '⌘D',
      action: () => navigate('/dashboard'),
      category: 'navigation'
    },
    {
      id: 'music',
      icon: <Music className="h-4 w-4" />,
      label: 'Musicothérapie',
      shortcut: '⌘M',
      action: () => navigate('/music'),
      category: 'navigation'
    },
    {
      id: 'coach',
      icon: <MessageCircle className="h-4 w-4" />,
      label: 'Coach IA',
      shortcut: '⌘C',
      action: () => navigate('/coach'),
      category: 'navigation'
    },
    {
      id: 'community',
      icon: <Users className="h-4 w-4" />,
      label: 'Communauté',
      shortcut: '⌘F',
      action: () => navigate('/community'),
      category: 'navigation'
    },
    {
      id: 'planning',
      icon: <Calendar className="h-4 w-4" />,
      label: 'Planning',
      action: () => navigate('/planning'),
      category: 'navigation'
    },
    
    // User items
    {
      id: 'profile',
      icon: <User className="h-4 w-4" />,
      label: 'Mon profil',
      action: () => navigate('/profile'),
      category: 'user'
    },
    {
      id: 'settings',
      icon: <Settings className="h-4 w-4" />,
      label: 'Paramètres',
      shortcut: '⌘S',
      action: () => navigate('/settings'),
      category: 'user'
    },
    {
      id: 'notifications',
      icon: <Bell className="h-4 w-4" />,
      label: 'Notifications',
      action: () => navigate('/notifications'),
      category: 'user'
    },
    {
      id: 'logout',
      icon: <LogOut className="h-4 w-4" />,
      label: 'Se déconnecter',
      action: () => logout && logout(),
      category: 'user'
    },
    
    // System actions
    {
      id: 'theme',
      icon: <Sparkles className="h-4 w-4" />,
      label: `Thème: ${theme === 'light' ? 'Clair' : theme === 'dark' ? 'Sombre' : theme === 'system' ? 'Système' : 'Pastel'}`,
      action: toggleTheme,
      category: 'system'
    },
    {
      id: 'search',
      icon: <Search className="h-4 w-4" />,
      label: 'Recherche globale',
      shortcut: '⌘P',
      action: () => navigate('/search'),
      category: 'system'
    },
  ];
  
  // Filter items based on search term
  const filteredItems = commandItems.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveItemIndex(prev => (prev + 1) % filteredItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveItemIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[activeItemIndex]) {
            filteredItems[activeItemIndex].action();
            onOpenChange(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange(false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredItems, activeItemIndex, onOpenChange]);
  
  // Reset active index when filtered items change
  useEffect(() => {
    setActiveItemIndex(0);
  }, [filteredItems.length]);
  
  // Close on click outside
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#command-menu')) {
        onOpenChange(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onOpenChange]);
  
  if (!open) return null;
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => onOpenChange(false)}
          />
          
          {/* Command Menu */}
          <motion.div
            id="command-menu"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2, type: 'spring' }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-background border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="flex items-center p-4 border-b">
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <button onClick={() => onOpenChange(false)} className="p-1 rounded-full hover:bg-accent">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="py-2 max-h-[60vh] overflow-y-auto">
              {['navigation', 'user', 'system'].map((category) => {
                const categoryItems = filteredItems.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;
                
                return (
                  <div key={category} className="mb-2">
                    <div className="px-4 py-1 text-xs text-muted-foreground uppercase tracking-wider">
                      {category === 'navigation' && 'Navigation'}
                      {category === 'user' && 'Utilisateur'}
                      {category === 'system' && 'Système'}
                    </div>
                    
                    {categoryItems.map((item, index) => {
                      const isActive = filteredItems.indexOf(item) === activeItemIndex;
                      return (
                        <button
                          key={item.id}
                          className={cn(
                            "w-full px-4 py-2 flex items-center justify-between text-left",
                            isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                          )}
                          onClick={() => {
                            item.action();
                            onOpenChange(false);
                          }}
                          onMouseEnter={() => setActiveItemIndex(filteredItems.indexOf(item))}
                        >
                          <div className="flex items-center">
                            <span className={cn(
                              "h-8 w-8 rounded-full mr-3 flex items-center justify-center",
                              isActive ? "bg-background/60" : "bg-background/30"
                            )}>
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          {item.shortcut && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              
              {filteredItems.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-muted-foreground">Aucun résultat pour "{searchTerm}"</p>
                </div>
              )}
            </div>
            
            <div className="p-2 text-center border-t text-xs text-muted-foreground">
              Naviguer avec ↑↓, sélectionner avec Enter
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandMenu;
