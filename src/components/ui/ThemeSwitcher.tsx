
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Theme } from '@/types/theme';

interface ThemeSwitcherProps {
  size?: 'sm' | 'md' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  size = 'icon',
  variant = 'outline',
  className = ''
}) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Helper to get the appropriate icon
  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case 'pastel':
        return <Palette className="h-[1.2rem] w-[1.2rem]" />;
      case 'system':
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  // Handle theme change with animation
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
    
    // Add animation class to body for smooth transition
    document.body.classList.add('animate-theme-transition');
    setTimeout(() => {
      document.body.classList.remove('animate-theme-transition');
    }, 500);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={`relative ${className}`}
          aria-label="Changer le thème"
        >
          {getThemeIcon()}
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 animate-in zoom-in-90 duration-300">
        <DropdownMenuLabel>Apparence</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className={`flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleThemeChange('light')}
        >
          <Sun className="h-4 w-4" />
          <div className="flex flex-col">
            <span>Clair</span>
            <span className="text-xs text-muted-foreground">Design épuré, lumineux</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={`flex items-center gap-2 cursor-pointer ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleThemeChange('dark')}
        >
          <Moon className="h-4 w-4" />
          <div className="flex flex-col">
            <span>Sombre</span>
            <span className="text-xs text-muted-foreground">Design profond, accents lumineux</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={`flex items-center gap-2 cursor-pointer ${theme === 'pastel' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleThemeChange('pastel')}
        >
          <Palette className="h-4 w-4" />
          <div className="flex flex-col">
            <span>Bleu Pastel</span>
            <span className="text-xs text-muted-foreground">Design doux, tons apaisants</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className={`flex items-center gap-2 cursor-pointer ${theme === 'system' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => handleThemeChange('system')}
        >
          <Monitor className="h-4 w-4" />
          <div className="flex flex-col">
            <span>Système</span>
            <span className="text-xs text-muted-foreground">Basé sur vos préférences système</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
