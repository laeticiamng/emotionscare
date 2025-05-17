
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/types/theme';
import { Moon, Sun } from 'lucide-react';

interface ThemeButtonProps {
  theme?: Theme;
  onClick?: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ onClick }) => {
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
      size="sm"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
};

export default ThemeButton;
