
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  minimal?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ minimal = false, className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  if (minimal) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn("relative", className)}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    );
  }
  
  return (
    <div className={cn("flex p-1 gap-1 bg-muted rounded-lg", className)}>
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => toggleTheme()}
        className="w-8 h-8 p-0"
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => toggleTheme()}
        className="w-8 h-8 p-0"
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => toggleTheme()}
        className="w-8 h-8 p-0"
        aria-label="System theme"
      >
        <Laptop className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'pastel' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => toggleTheme()}
        className="w-8 h-8 p-0"
        aria-label="Pastel theme"
      >
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ThemeToggle;
