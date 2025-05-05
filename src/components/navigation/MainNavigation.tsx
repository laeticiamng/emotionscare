
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import NavItem from './NavItem';
import UserMenu from './UserMenu';
import GuestMenu from './GuestMenu';
import { useAuth } from '@/contexts/AuthContext';
import { navItems, adminNavItems } from './navConfig';
import { isAdminRole } from '@/utils/roleUtils';
import { fetchBadgesCount } from '@/lib/dashboardService';

const MainNavigation: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [badgesCount, setBadgesCount] = useState<number>(0);
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  // Sélectionner les bons éléments de navigation en fonction du rôle
  const navigationItems = isAdmin ? adminNavItems : navItems;

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
    <div className="flex flex-col gap-2 py-2">
      {navigationItems.map((item) => (
        <NavItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          to={item.path}
          active={pathname === item.path || pathname.startsWith(`${item.path}/`)}
        />
      ))}
      
      <Separator className="my-2" />
      
      {user ? (
        <UserMenu badgesCount={badgesCount} />
      ) : (
        <GuestMenu />
      )}

      <Separator className="my-2" />
    </div>
  );
};

export default MainNavigation;
