
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Music } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { openDrawer } = useMusic();
  const navigate = useNavigate();

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
      
      <div className="text-sm text-right mr-2">
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.role}</p>
      </div>
      <Avatar className="h-9 w-9">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleLogout} 
        title="Déconnexion"
        aria-label="Déconnexion"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default UserMenu;
