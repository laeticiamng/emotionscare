
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Settings, Briefcase, BarChart2, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { isAdminRole, getRoleDisplayName } from '@/utils/roleUtils';

interface UserMenuProps {
  badgesCount: number;
}

const UserMenu: React.FC<UserMenuProps> = ({ badgesCount }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  
  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous avez été déconnecté de votre compte.',
    });
    navigate('/');
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
        
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
              <BarChart2 className="mr-2 h-4 w-4" />
              <span>Tableau de bord admin</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/users')}>
              <Building className="mr-2 h-4 w-4" />
              <span>Gestion d'entreprise</span>
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
          <span>Settings</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal text-xs">Mode utilisateur</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setUserMode(userMode === 'b2b-admin' ? 'b2c' : 'b2b-admin')}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>{userMode === 'b2b-admin' ? 'Vue utilisateur' : 'Vue administrateur'}</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <Lock className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1.5 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <path d="M3 3h18v18H3z" />
              <path d="m9.17 14.83 5.66-5.66" />
            </svg>
            Ctrl+Shift+Q
          </kbd>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
