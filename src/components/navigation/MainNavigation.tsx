
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import NavItem from './NavItem';
import UserMenu from './UserMenu';
import GuestMenu from './GuestMenu';
import { useAuth } from '@/contexts/AuthContext';
import { sidebarItems, adminSidebarItems } from './navConfig';
import { isAdminRole } from '@/utils/roleUtils';
import { fetchBadgesCount } from '@/lib/dashboardService';

const MainNavigation: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [badgesCount, setBadgesCount] = useState<number>(0);
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  // Note: Cette composante n'est plus utilisée dans l'interface principale,
  // mais nous gardons le code mis à jour au cas où
  const navigationItems = isAdmin ? adminSidebarItems : sidebarItems;

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
          key={item.href}
          icon={item.icon ? React.createElement(item.icon) : null}
          label={item.title}
          to={item.href}
          active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
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
