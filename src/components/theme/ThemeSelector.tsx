
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  minimal?: boolean;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ minimal = false, className = "" }) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  
  const themes = [
    {
      id: 'light',
      name: 'Clair',
      icon: Sun,
      description: 'Thème lumineux pour une utilisation de jour',
      color: 'bg-blue-100'
    },
    {
      id: 'dark',
      name: 'Sombre',
      icon: Moon,
      description: 'Thème sombre pour une utilisation de nuit',
      color: 'bg-slate-800'
    },
    {
      id: 'system',
      name: 'Système',
      icon: Monitor,
      description: 'Se synchronise avec votre système',
      color: 'bg-gradient-to-r from-blue-100 to-slate-800'
    },
    {
      id: 'pastel',
      name: 'Pastel',
      icon: Palette,
      description: 'Couleurs douces et apaisantes',
      color: 'bg-blue-50'
    }
  ];

  const getCurrentThemeIcon = () => {
    const currentTheme = themes.find(t => t.id === theme) || themes[0];
    const Icon = currentTheme.icon;
    return <Icon className="h-[1.2rem] w-[1.2rem]" />;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("rounded-full", className)}
          aria-label="Changer de thème"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            {getCurrentThemeIcon()}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Thème d'affichage</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          const isActive = theme === themeOption.id;
          
          return (
            <DropdownMenuItem
              key={themeOption.id}
              className={cn(
                "flex items-center cursor-pointer gap-2",
                isActive && "bg-accent"
              )}
              onClick={() => {
                setTheme(themeOption.id);
                setOpen(false);
              }}
            >
              <div className={cn("w-4 h-4 rounded-full", themeOption.color)} />
              <div className="flex flex-1 justify-between items-center">
                <span>{themeOption.name}</span>
                {isActive && <Check className="h-4 w-4" />}
              </div>
            </DropdownMenuItem>
          );
        })}
        
        {!minimal && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground cursor-default">
              Le thème est appliqué instantanément
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
