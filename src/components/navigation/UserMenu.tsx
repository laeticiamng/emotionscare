
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Music, User, Moon, Sun, Settings, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { openDrawer } = useMusic();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="hidden md:flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={openDrawer} 
        title="Soundtrack du bien-être"
        aria-label="Ouvrir le lecteur de musique"
        className="relative"
      >
        <Music className="h-5 w-5" />
        <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-primary"></span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="text-sm text-right mr-2">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <Avatar className="h-9 w-9 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_8px_rgba(168,230,207,0.5)]">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border border-slate-200">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate('/preferences')} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Mon compte</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
            {theme === 'dark' ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                <span>Mode Clair</span>
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                <span>Mode Sombre</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/account-settings')} className="cursor-pointer">
            <Mail className="mr-2 h-4 w-4" />
            <span>Modifier email & mot de passe</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
