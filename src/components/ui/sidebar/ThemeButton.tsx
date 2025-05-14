
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Theme } from '@/types/types';

interface ThemeButtonProps {
  theme: Theme;
  onClick: () => void;
}

export function ThemeButton({ theme, onClick }: ThemeButtonProps) {
  const { isDarkMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
