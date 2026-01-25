import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';
import { useTheme } from '@/providers/theme';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import NotificationBell from '@/components/notifications/NotificationBell';

interface EnhancedHeaderProps {
  onMenuToggle?: () => void;
  showProgress?: boolean;
  scrollProgress?: number;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ 
  onMenuToggle, 
  showProgress = false, 
  scrollProgress = 0 
}) => {
  const {  } = useTheme();
  
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <motion.h1 
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            EmotionsCare
          </motion.h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Rechercher">
            <Search className="h-4 w-4" aria-hidden="true" />
          </Button>
          <NotificationBell />
          <ThemeSwitcher />
        </div>
      </div>
      
      {showProgress && (
        <motion.div 
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
        />
      )}
    </motion.header>
  );
};

export default EnhancedHeader;
