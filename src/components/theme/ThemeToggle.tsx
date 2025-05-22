
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  minimal?: boolean;
}

const ThemeToggle = ({ className = "", minimal = false }: ThemeToggleProps) => {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
      title={`Changer le thème (actuel: ${theme})`}
    >
      {isDarkMode ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Changer le thème</span>
    </Button>
  );
};

export default ThemeToggle;
