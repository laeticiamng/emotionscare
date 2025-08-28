/**
 * 🚀 MIGRATED TO ROUTERV2 - Phase 2 Complete
 * All hardcoded links replaced with typed Routes.xxx() helpers
 * TICKET: FE/BE-Router-Cleanup-02
 */

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Routes } from '@/routerV2';
import { useBranding } from '@/hooks/useBranding';
import { cn } from '@/lib/utils';
import { useNotificationBadge } from '@/hooks/useNotificationBadge';
import { Bell, Home, Settings, User, Users, GraduationCap, BookOpenCheck, BarChart, LogOut, Sparkles } from 'lucide-react';

export function MainNavigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { logoUrl, companyName } = useBranding();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const badgeState = useNotificationBadge();
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    if (badgeState.count !== undefined) {
      setBadgeCount(badgeState.count);
    }
    
    // Set badges count using the proper type (number, not string)
    if (badgeState.badgesCount !== undefined) {
      setBadgeCount(badgeState.badgesCount);
    }
    
    if (badgeState.notificationsCount !== undefined) {
      setBadgeCount(badgeState.notificationsCount);
    }
  }, [badgeState]);

  const handleLogout = async () => {
    await logout();
    navigate(Routes.login());
  };

  const navigationItems = [
    { label: 'Accueil', href: Routes.home(), icon: <Home className="mr-2 h-4 w-4" /> },
    { label: 'Profil', href: Routes.settingsProfile(), icon: <User className="mr-2 h-4 w-4" /> },
    { label: 'Paramètres', href: Routes.settingsGeneral(), icon: <Settings className="mr-2 h-4 w-4" /> },
    { label: 'Dashboard', href: Routes.consumerHome(), icon: <BarChart className="mr-2 h-4 w-4" /> },
    { label: 'Prédictif', href: Routes.adminReports(), icon: <Sparkles className="mr-2 h-4 w-4" /> },
    { label: 'Équipe', href: Routes.teams(), icon: <Users className="mr-2 h-4 w-4" /> },
    { label: 'Formations', href: Routes.adminEvents(), icon: <GraduationCap className="mr-2 h-4 w-4" /> },
    { label: 'Ressources', href: Routes.help(), icon: <BookOpenCheck className="mr-2 h-4 w-4" /> },
  ];

  const renderNavItem = (item: any) => (
    <li key={item.href}>
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          )
        }
      >
        {item.icon}
        {item.label}
      </NavLink>
    </li>
  );

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to={Routes.home()} className="mr-4 flex items-center space-x-2">
          {logoUrl && <img src={logoUrl} alt="Logo" className="h-8 w-auto" />}
          <span className="font-bold">{companyName || 'Nom de l\'entreprise'}</span>
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-6">
            {navigationItems.map(renderNavItem)}
          </ul>
        </nav>
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {badgeCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
                    {badgeCount}
                  </div>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  Ici, vous pouvez voir vos dernières notifications.
                </SheetDescription>
              </SheetHeader>
              {/* Notifications content here */}
            </SheetContent>
          </Sheet>
          <Avatar className="ml-4">
            <AvatarImage src={user?.avatar_url} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2">
                {user?.name}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Options du compte et navigation.
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-6">
                <ul>
                  {navigationItems.map(renderNavItem)}
                  <li>
                    <Button
                      variant="ghost"
                      className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
