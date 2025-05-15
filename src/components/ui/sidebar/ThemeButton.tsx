
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import { ThemeButtonProps } from '@/types';

const ThemeButton: React.FC<ThemeButtonProps> = ({
  theme: propTheme,
  onClick,
  collapsed = false
}) => {
  const { theme: contextTheme, setTheme } = useTheme();
  
  // Use the prop theme if provided, otherwise use the context theme
  const theme = propTheme || contextTheme;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Cycle through themes: light -> dark -> system -> light
      const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
      setTheme(nextTheme);
    }
  };
  
  return (
    <Button
      variant="ghost"
      size={collapsed ? 'icon' : 'sm'}
      onClick={handleClick}
      className={collapsed ? 'w-9 h-9 p-0' : ''}
      title={collapsed ? `Mode ${theme === 'light' ? 'clair' : theme === 'dark' ? 'sombre' : 'système'}` : undefined}
    >
      {theme === 'light' ? (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          {!collapsed && <span className="ml-2">Clair</span>}
        </>
      ) : theme === 'dark' ? (
        <>
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          {!collapsed && <span className="ml-2">Sombre</span>}
        </>
      ) : (
        <>
          <Monitor className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          {!collapsed && <span className="ml-2">Système</span>}
        </>
      )}
    </Button>
  );
};

export default ThemeButton;
