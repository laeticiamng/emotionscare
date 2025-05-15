
import React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Theme } from '@/types';

interface ThemeSelectorProps {
  minimal?: boolean;
  className?: string;
}

export function ThemeSelector({ minimal = false, className = '' }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: "light",
      label: "Clair",
      icon: <Sun className="h-4 w-4" />,
    },
    {
      value: "dark",
      label: "Sombre",
      icon: <Moon className="h-4 w-4" />,
    },
    {
      value: "pastel",
      label: "Pastel",
      icon: <Palette className="h-4 w-4" />,
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {themes.map((themeOption) => (
        <Button
          key={themeOption.value}
          variant={theme === themeOption.value ? "default" : "outline"}
          size={minimal ? "icon" : "sm"}
          onClick={() => setTheme(themeOption.value)}
          className={minimal ? "w-8 h-8 p-0" : ""}
          title={themeOption.label}
        >
          {themeOption.icon}
          {!minimal && <span className="ml-2">{themeOption.label}</span>}
        </Button>
      ))}
    </div>
  );
}

export default ThemeSelector;
