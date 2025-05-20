
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { cn } from '@/lib/utils';
import { Home, Calendar, Music, Timeline, Globe, Sun, Settings, Book, Map } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
}

const UnifiedSidebar: React.FC<{
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}> = ({ className = '', isMobile = false, onClose }) => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  // Generate nav items based on user role
  useEffect(() => {
    const baseItems: NavItem[] = [
      { label: 'Accueil', icon: <Home className="h-5 w-5" />, href: '/dashboard' },
      { label: 'Journal', icon: <Book className="h-5 w-5" />, href: '/journal' },
      { label: 'Musique', icon: <Music className="h-5 w-5" />, href: '/music' },
      { label: 'Timeline', icon: <Timeline className="h-5 w-5" />, href: '/timeline' },
      { label: 'Monde', icon: <Globe className="h-5 w-5" />, href: '/world' },
      { label: 'Sanctuaire', icon: <Sun className="h-5 w-5" />, href: '/sanctuary' },
    ];
    
    // Add additional items for b2b users
    const b2bItems: NavItem[] = [
      { label: 'Équipes', icon: <Calendar className="h-5 w-5" />, href: '/teams', roles: ['b2b_user', 'b2b_admin'] },
      { label: 'Cartographie', icon: <Map className="h-5 w-5" />, href: '/mapping', roles: ['b2b_admin'] },
    ];
    
    // Combine items based on user role
    let combinedItems = [...baseItems];
    
    if (userMode && (userMode === 'b2b_user' || userMode === 'b2b_admin')) {
      combinedItems = [
        ...combinedItems,
        ...b2bItems.filter(item => !item.roles || item.roles.includes(userMode))
      ];
    }
    
    // Add settings at the end
    combinedItems.push({ 
      label: 'Paramètres', 
      icon: <Settings className="h-5 w-5" />, 
      href: '/settings' 
    });
    
    setNavItems(combinedItems);
  }, [userMode]);

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "border-r w-64 h-screen flex flex-col bg-background",
        className
      )}
    >
      {isMobile && (
        <div className="h-16 border-b flex items-center px-4 font-bold text-lg">
          EmotionsCare
        </div>
      )}
      
      <ScrollArea className="flex-1 py-6">
        <nav className="px-2 space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-normal",
                    isActive ? "bg-secondary" : ""
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </motion.div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default UnifiedSidebar;
