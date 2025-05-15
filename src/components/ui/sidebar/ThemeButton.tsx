
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeButtonProps, Theme } from '@/types';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const ThemeButton: React.FC<ThemeButtonProps> = ({ onClick, collapsed, size }) => {
  const { theme, setTheme, isDarkMode } = useTheme();
  
  const toggleTheme = () => {
    const newTheme: Theme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size={size as any || 'sm'}
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      className={collapsed ? 'w-10 h-10 p-0' : ''}
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      {!collapsed && <span className="ml-2">Theme</span>}
    </Button>
  );
};

export default ThemeButton;
