
import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

interface ThemeSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'outline',
  size = 'md',
  showLabel = false,
}) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };
  
  const sizeClasses = {
    sm: 'h-8 rounded-md',
    md: 'h-10 rounded-md',
    lg: 'h-12 text-lg rounded-lg',
  };
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 22,
  };

  return (
    <Button
      variant={variant}
      size="sm"
      className={`relative ${sizeClasses[size]} overflow-hidden`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      <div className="relative z-10 flex items-center gap-2">
        {isDark ? (
          <Sun size={iconSizes[size]} className="text-yellow-300" />
        ) : (
          <Moon size={iconSizes[size]} className="text-blue-600" />
        )}
        
        {showLabel && (
          <span className="text-sm">
            {isDark ? 'Mode clair' : 'Mode sombre'}
          </span>
        )}
      </div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 from-yellow-100 to-orange-100 z-0"
        initial={false}
        animate={{
          opacity: [0, 1],
        }}
        transition={{
          duration: 0.5,
        }}
        key={isDark ? 'dark' : 'light'}
      />
    </Button>
  );
};

export default ThemeSwitcher;
