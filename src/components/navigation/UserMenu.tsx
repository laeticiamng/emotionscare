
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, UserCircle } from 'lucide-react';

interface UserMenuProps {
  mobile?: boolean;
  onClose?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ mobile = false, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    if (onClose) {
      onClose();
    }
    navigate(path);
  };

  const handleLogout = async () => {
    if (onClose) {
      onClose();
    }
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher le bouton de connexion
  if (!user) {
    return (
      <div className={`flex ${mobile ? 'flex-col w-full' : ''} gap-2`}>
        <Button
          variant={mobile ? "default" : "outline"}
          className={mobile ? "w-full justify-center" : ""}
          onClick={() => handleItemClick('/login')}
        >
          Se connecter
        </Button>
        <Button
          variant={mobile ? "outline" : "default"}
          className={mobile ? "w-full justify-center" : ""}
          onClick={() => handleItemClick('/register')}
        >
          S'inscrire
        </Button>
      </div>
    );
  }

  // Si l'utilisateur est connecté et que c'est la version mobile, afficher les options directement
  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || user.avatar_url || user.avatarUrl} alt={user.name || 'Avatar'} />
            <AvatarFallback>{(user.name || 'U').charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-base font-medium">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => handleItemClick('/profile')}
        >
          <UserCircle className="h-4 w-4" />
          Profil
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => handleItemClick('/settings')}
        >
          <Settings className="h-4 w-4" />
          Paramètres
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    );
  }

  // Version desktop avec dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || user.avatar_url || user.avatarUrl} alt={user.name || 'Avatar'} />
            <AvatarFallback>{(user.name || 'U').charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleItemClick('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleItemClick('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
