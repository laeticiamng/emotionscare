
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { ThemeButtonProps } from "@/types";

export function ThemeButton({ size = "md", collapsed = false }: ThemeButtonProps) {
  const { theme, setTheme, isDarkMode } = useTheme();

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <button
      className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground w-full transition-colors`}
      onClick={toggleTheme}
    >
      {isDarkMode ? (
        <Moon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      ) : (
        <SunMedium className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      )}
      {!collapsed && (
        <span className="text-sm">
          {isDarkMode ? "Mode clair" : "Mode sombre"}
        </span>
      )}
    </button>
  );
}

export default ThemeButton;
