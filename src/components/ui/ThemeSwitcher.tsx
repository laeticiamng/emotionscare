
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeName } from '@/types';

interface ThemeSwitcherProps {
  minimal?: boolean;
}

export function ThemeSwitcher({ minimal = false }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  const themes: { value: ThemeName; label: string; icon: React.ReactNode }[] = [
    {
      value: "light",
      label: "Light",
      icon: <Sun className="h-4 w-4" />,
    },
    {
      value: "dark",
      label: "Dark",
      icon: <Moon className="h-4 w-4" />,
    },
    {
      value: "system",
      label: "System",
      icon: <Monitor className="h-4 w-4" />,
    },
  ];

  return (
    <div className={minimal ? "" : "py-2"}>
      {minimal ? null : <p className="mb-2 text-sm font-medium">Appearance</p>}
      <div className="flex gap-2">
        {themes.map((themeOption) => (
          <Button
            key={themeOption.value}
            variant={theme === themeOption.value ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme(themeOption.value)}
            className={minimal ? "px-2" : ""}
          >
            {themeOption.icon}
            {!minimal && <span className="ml-1">{themeOption.label}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSwitcher;
