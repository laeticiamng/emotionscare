
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeButtonProps } from '@/types';

export function ThemeButton({ variant = 'icon', showLabel = false, size = 'md', onClick, collapsed }: ThemeButtonProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    if (onClick) onClick();
  };

  return (
    <Button
      variant="ghost"
      size={size as any} // Temporarily cast to any to avoid size type issues
      onClick={toggleTheme}
      className="w-full justify-start"
    >
      {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      {(showLabel || variant === 'text' || variant === 'both') && !collapsed && (
        <span className="ml-2">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </Button>
  );
}

export default ThemeButton;
