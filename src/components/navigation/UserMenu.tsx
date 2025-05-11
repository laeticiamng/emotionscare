
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Settings, Briefcase, BarChart2, Building, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { isAdminRole, getRoleDisplayName } from '@/utils/roleUtils';

interface UserMenuProps {
  badgesCount?: number;
}

const UserMenu: React.FC<UserMenuProps> = ({ badgesCount = 0 }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie', {
        description: 'Vous avez été déconnecté de votre compte.',
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const getAvatarFallback = () => {
    return user?.name?.charAt(0)?.toUpperCase() || '?';
  };
  
  // Use avatar as fallback if image is not available
  const userImage = user?.image || user?.avatar || user?.avatar_url;
  
  // Check if user has admin role
  const isAdmin = isAdminRole(user.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
          <Avatar className="h-6 w-6">
            <AvatarImage src={userImage} alt={user?.name || 'Profile'} />
            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
          </Avatar>
          <span className="text-left">
            {user?.name}
            {badgesCount > 0 && (
              <Badge className="ml-1">{badgesCount}</Badge>
            )}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              {getRoleDisplayName(user.role || 'user')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <BarChart2 className="mr-2 h-4 w-4" />
          <span>Mon tableau de bord</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
              <Building className="mr-2 h-4 w-4" />
              <span>Tableau de bord admin</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal text-xs">Mode utilisateur</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {
              const newMode = userMode === 'b2b-admin' ? 'b2c' : 'b2b-admin';
              setUserMode(newMode);
              toast.success(`Mode changé: ${newMode === 'b2c' ? 'Utilisateur' : 'Administrateur'}`)
            }}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>{userMode === 'b2b-admin' ? 'Vue utilisateur' : 'Vue administrateur'}</span>
            </DropdownMenuItem>
          </>
        )}
        
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
