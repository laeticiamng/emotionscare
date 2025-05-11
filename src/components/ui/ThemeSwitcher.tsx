import React, { useEffect } from 'react';
import { Moon, Sun, Laptop, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme/ThemeProvider';
import { ThemeName } from '@/types';

interface ThemeSwitcherProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
  showLabel?: boolean;
}

const ThemeSwitcher = ({ size = 'icon', variant = 'ghost', className = '', showLabel = false }: ThemeSwitcherProps) => {
  const { theme, resolvedTheme, setTheme, setThemePreference } = useTheme();

  // Icons based on current theme
  const getIcon = () => {
    if (theme === 'system') {
      return <Laptop size={size === 'icon' ? 18 : 16} />;
    }
    
    if (theme === 'dark') {
      return <Moon size={size === 'icon' ? 18 : 16} />;
    }
    
    if (theme === 'pastel') {
      return <Palette size={size === 'icon' ? 18 : 16} />;
    }
    
    return <Sun size={size === 'icon' ? 18 : 16} />;
  };
  
  // Text label for current theme
  const getLabel = () => {
    switch (theme) {
      case 'light': return 'Clair';
      case 'dark': return 'Sombre';
      case 'system': return 'Système';
      case 'pastel': return 'Pastel';
      default: return 'Thème';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={`gap-2 ${className}`}>
          {getIcon()}
          {size !== 'icon' && getLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setTheme('light')}
        >
          <Sun size={16} />
          <span>Clair</span>
          {theme === 'light' && <span className="ml-auto text-xs text-green-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setTheme('dark')}
        >
          <Moon size={16} />
          <span>Sombre</span>
          {theme === 'dark' && <span className="ml-auto text-xs text-green-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setTheme('pastel')}
        >
          <Palette size={16} />
          <span>Pastel</span>
          {theme === 'pastel' && <span className="ml-auto text-xs text-green-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setTheme('system')}
        >
          <Laptop size={16} />
          <span>Système</span>
          {theme === 'system' && <span className="ml-auto text-xs text-green-500">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
