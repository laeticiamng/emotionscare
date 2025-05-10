
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getRoleName } from '@/utils/roleUtils';

interface AuthButtonProps {
  minimal?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ minimal = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
      navigate('/');
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  if (!user) {
    return (
      <Button
        variant={minimal ? "ghost" : "default"}
        size={minimal ? "sm" : "default"}
        onClick={handleLogin}
        className="flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        <span>Se connecter</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          aria-label="Menu utilisateur"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || ''} alt={user.name || 'Utilisateur'} />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role && (
          <>
            <DropdownMenuLabel className="font-normal">
              <p className="text-xs text-muted-foreground">
                Rôle: {getRoleName(user.role)}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
