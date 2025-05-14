
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeButtonProps } from '@/types/types';

const ThemeButton: React.FC<ThemeButtonProps> = ({ theme, onClick, collapsed = false }) => {
  const { theme: currentTheme, setTheme } = useTheme();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Toggle between light and dark
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
  };

  const isDark = theme === 'dark' || (theme === undefined && currentTheme === 'dark');
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={handleClick}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {!collapsed && <span className="ml-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
    </Button>
  );
};

export default ThemeButton;
