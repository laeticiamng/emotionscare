
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { ThemeButtonProps } from "@/types";

export function ThemeButton({ collapsed, size = "default" }: ThemeButtonProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "group flex justify-start gap-2",
        collapsed && "w-full justify-center py-7",
        size === "sm" && "h-8 rounded-md px-2"
      )}
    >
      {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
      {!collapsed && (
        <span className="text-sm">
          {theme === "dark" ? "Mode sombre" : "Mode clair"}
        </span>
      )}
    </Button>
  );
}
