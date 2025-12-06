// @ts-nocheck

// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  BarChart2, 
  FileText, 
  Heart, 
  Music, 
  Shield,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Vous avez été déconnecté avec succès');
      navigate('/');
    } catch (error) {
      logger.error('Logout error', error as Error, 'UI');
      toast.error('Une erreur est survenue lors de la déconnexion');
    }
  };

  const getInitials = (name: string = 'Utilisateur') => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-2 p-1 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name || 'Utilisateur'} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium">
            {user?.name ? user.name.split(' ')[0] : 'Utilisateur'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/app/consumer/home')}>
            <BarChart2 className="mr-2 h-4 w-4" />
            <span>Tableau de bord</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/settings/general')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/settings/notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/journal')}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Journal</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/music')}>
            <Music className="mr-2 h-4 w-4" />
            <span>Musicothérapie</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/app/scan')}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Scan émotionnel</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/admin/unified')}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Administration</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/help')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Aide</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
