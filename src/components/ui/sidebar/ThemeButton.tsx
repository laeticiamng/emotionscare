
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { ThemeButtonProps } from '@/types';

const ThemeButton: React.FC<ThemeButtonProps> = ({ theme, onClick, collapsed }) => {
  const { theme: currentTheme, setTheme } = useTheme();
  
  const activeTheme = theme || currentTheme;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Cycle through themes: light -> dark -> system
      const nextTheme = activeTheme === 'light' ? 'dark' : activeTheme === 'dark' ? 'system' : 'light';
      setTheme(nextTheme);
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="w-full justify-start" 
      onClick={handleClick}
    >
      {activeTheme === 'light' && (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all mr-2" />
          {!collapsed && <span>Light Mode</span>}
        </>
      )}
      {activeTheme === 'dark' && (
        <>
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all mr-2" />
          {!collapsed && <span>Dark Mode</span>}
        </>
      )}
      {activeTheme === 'system' && (
        <>
          <Laptop className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all mr-2" />
          {!collapsed && <span>System Theme</span>}
        </>
      )}
    </Button>
  );
};

export default ThemeButton;
