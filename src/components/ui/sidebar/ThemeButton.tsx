
import React from 'react';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, Theme } from '@/contexts/ThemeContext';

interface ThemeButtonProps {
  iconOnly?: boolean;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ iconOnly = false }) => {
  const themeContext = useTheme();
  
  if (!themeContext) {
    return null;
  }
  
  const { theme, setTheme } = themeContext;
  
  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Clair', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Sombre', icon: <Moon size={16} /> },
    { value: 'system', label: 'Système', icon: <Laptop size={16} /> },
    { value: 'pastel', label: 'Pastel', icon: <Palette size={16} /> },
  ];
  
  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={iconOnly ? "icon" : "sm"}
          className="w-full justify-start"
        >
          {currentTheme.icon}
          {!iconOnly && (
            <span className="ml-2">{currentTheme.label}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => setTheme(item.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {item.icon}
            <span>{item.label}</span>
            {theme === item.value && (
              <span className="ml-auto text-xs text-green-500">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeButton;
