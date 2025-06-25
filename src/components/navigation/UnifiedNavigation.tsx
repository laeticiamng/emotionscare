import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Moon, Sun, Menu, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const UnifiedNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isOpen, onOpen, onClose } = useSidebar();

  const developmentLinks = import.meta.env.MODE === 'development' ? [
    {
      label: 'Debug',
      href: '/debug',
      icon: <Terminal className="h-4 w-4" />,
    }
  ] : [];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center py-4">
        <Button variant="ghost" size="icon" onClick={isOpen ? onClose : onOpen} className="mr-2 md:hidden">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <Link to="/" className="font-bold text-xl mr-4">
          EmotionsCare
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/coach" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Coach
          </Link>
          <Link to="/journal" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Journal
          </Link>
          <Link to="/music" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Music
          </Link>
        </div>
        
        {import.meta.env.MODE === 'development' && (
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <a
              href="/debug"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Debug
            </a>
          </div>
        )}

        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || "https://avatars.dicebear.com/api/open-peeps/example.svg"} alt={user?.email || "Avatar"} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to="/profile" className="w-full h-full block">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/preferences" className="w-full h-full block">
                  Préférences
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default UnifiedNavigation;
