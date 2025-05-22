
import React from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Settings,
  LifeBuoy,
  LogOut,
  BarChart,
  Shield,
  UserPlus,
  Bell,
  BadgeCheck
} from 'lucide-react';

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Dans un vrai scénario, cela serait récupéré du contexte ou d'une requête API
  const hasNotifications = true;
  const isPremium = false;

  const handleLogout = async () => {
    try {
      // Simuler un logout
      setTimeout(() => {
        toast.success('Déconnexion réussie');
        navigate('/');
      }, 500);
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/user.png" alt="User" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || 'Utilisateur'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'utilisateur@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <BarChart className="mr-2 h-4 w-4" />
            <span>Tableau de bord</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            {hasNotifications && (
              <span className="ml-auto flex h-2 w-2 rounded-full bg-primary"></span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/team')}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Inviter un collègue</span>
          </DropdownMenuItem>
          {isPremium ? (
            <DropdownMenuItem onClick={() => navigate('/account')}>
              <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
              <span>Compte Premium</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => navigate('/premium')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Passer à Premium</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/support')}>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
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

export default UserMenu;
