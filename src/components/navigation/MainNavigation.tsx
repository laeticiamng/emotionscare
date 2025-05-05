
import React from 'react';
import { 
  Home, 
  Compass, 
  Book, 
  LineChart, 
  MessageSquare, 
  CheckSquare, 
  PlayCircle, 
  BarChart
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import NavItem from './NavItem';
import UserMenu from './UserMenu';
import GuestMenu from './GuestMenu';
import FooterLinks from './FooterLinks';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { fetchBadgesCount } from '@/lib/dashboardService';

const MainNavigation: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
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
        <UserMenu badgesCount={badgesCount} />
      ) : (
        <GuestMenu />
      )}

      <Separator className="my-2" />

      <FooterLinks />
    </div>
  );
};

export default MainNavigation;
