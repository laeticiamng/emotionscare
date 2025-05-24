
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut, Shield, Building } from 'lucide-react';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';

const UserNav: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getModeIcon = () => {
    switch (userMode) {
      case 'b2b_admin':
        return <Shield className="h-4 w-4" />;
      case 'b2b_user':
        return <Building className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/choose-mode')}
        >
          Se connecter
        </Button>
        <Button 
          onClick={() => navigate('/choose-mode')}
        >
          S'inscrire
        </Button>
      </div>
    );
  }

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur';
  const userEmail = user.email || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getModeIcon()}
              <span className="text-xs text-muted-foreground">
                {getUserModeDisplayName(userMode)}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/help')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Aide
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
