
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeButtonProps } from '@/types';

const ThemeButton: React.FC<ThemeButtonProps> = ({ theme, onClick, collapsed }) => {
  const { theme: currentTheme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    if (onClick) {
      onClick();
    } else {
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-md"
      onClick={handleToggleTheme}
      aria-label={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {currentTheme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
    </Button>
  );
};

export default ThemeButton;
