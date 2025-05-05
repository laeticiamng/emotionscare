import {
  BarChart,
  Book,
  CheckSquare,
  Compass,
  HelpCircle,
  Home,
  LineChart,
  Lock,
  MessageSquare,
  PlayCircle,
  Plus,
  Settings,
  User,
  User2,
  Cog,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { fetchBadgesCount } from '@/lib/dashboardService';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
        active ? 'bg-secondary text-foreground' : 'text-muted-foreground'
      }`}
      onClick={() => navigate(to)}
    >
      {icon}
      {label}
    </button>
  );
};

export const Navigation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading, signOut } = useAuth();
  const [badgesCount, setBadgesCount] = useState<number>(0);

  useEffect(() => {
    const loadBadgesCount = async () => {
      if (user?.id) {
        const count = await fetchBadgesCount(user.id);
        setBadgesCount(count);
      }
    };

    loadBadgesCount();
  }, [user?.id]);

  return (
    <div className="flex flex-col gap-1">
      <NavItem
        icon={<Home className="h-6 w-6" />}
        label="Tableau de bord"
        to="/dashboard"
        active={pathname === '/dashboard'}
      />
      <NavItem
        icon={<Compass className="h-6 w-6" />}
        label="Découvrir"
        to="/discover"
        active={pathname === '/discover'}
      />
      <NavItem
        icon={<Book className="h-6 w-6" />}
        label="Journal"
        to="/journal"
        active={pathname === '/journal'}
      />
      <NavItem
        icon={<LineChart className="h-6 w-6" />}
        label="Suivi"
        to="/tracking"
        active={pathname === '/tracking'}
      />
      <NavItem
        icon={<MessageSquare className="h-6 w-6" />}
        label="Communauté"
        to="/social-cocoon"
        active={pathname === '/social-cocoon'}
      />
      <NavItem
        icon={<CheckSquare className="h-6 w-6" />}
        label="Défis"
        to="/gamification"
        active={pathname === '/gamification'}
      />
      
      <NavItem
        icon={<PlayCircle className="h-6 w-6" />}
        label="Micro-pauses VR"
        to="/vr-sessions"
        active={pathname.includes('/vr-sessions')}
      />
      
      {/* Show admin VR analytics only for users with role === 'admin' */}
      {user?.role === 'admin' && (
        <NavItem
          icon={<BarChart className="h-6 w-6" />}
          label="Statistiques VR"
          to="/vr-analytics"
          active={pathname === '/vr-analytics'}
        />
      )}
      
      <Separator className="my-2" />

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.image} alt={user?.name || 'Profile'} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
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
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User2 className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
                toast({
                  title: 'Déconnexion réussie',
                  description: 'Vous avez été déconnecté de votre compte.',
                });
                navigate('/');
              }}
            >
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
      ) : (
        <>
          <NavItem
            icon={<Lock className="h-6 w-6" />}
            label="Se connecter"
            to="/login"
            active={pathname === '/login'}
          />
          <NavItem
            icon={<Plus className="h-6 w-6" />}
            label="S'inscrire"
            to="/register"
            active={pathname === '/register'}
          />
        </>
      )}

      <Separator className="my-2" />

      <NavItem
        icon={<Cog className="h-6 w-6" />}
        label="Paramètres"
        to="/settings"
        active={pathname === '/settings'}
      />
      <NavItem
        icon={<HelpCircle className="h-6 w-6" />}
        label="Aide"
        to="/help"
        active={pathname === '/help'}
      />
    </div>
  );
};
