
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Star } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center"
      aria-label="Toggle theme"
    >
      {theme === 'light' && <Sun className="h-5 w-5" />}
      {theme === 'dark' && <Moon className="h-5 w-5" />}
      {theme === 'pastel' && <Star className="h-5 w-5" />}
      <span className="ml-2 hidden md:inline">Thème</span>
    </Button>
  );
};

export default ThemeToggle;
