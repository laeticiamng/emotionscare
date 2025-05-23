
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, Settings, CreditCard } from 'lucide-react';

export function UserNav() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/choose-mode')}
      >
        Se connecter
      </Button>
    );
  }
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const getUserInitials = () => {
    if (!user?.user_metadata?.name) return 'U';
    
    const nameParts = user.user_metadata.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt="Avatar" />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.name || 'Utilisateur'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/billing')}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Abonnement</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
