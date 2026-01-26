// @ts-nocheck
/**
 * B2BLayout - Layout partagé pour toutes les pages B2B
 * Navigation latérale, header, et structure cohérente
 */

import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  FileText,
  Shield,
  Settings,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  AlertTriangle,
  Zap,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useB2BRole } from '@/hooks/useB2BRole';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  requiresAdmin?: boolean;
  requiresManager?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/b2b' },
  { label: 'Équipes', icon: Users, href: '/b2b/teams' },
  { label: 'Événements', icon: Calendar, href: '/b2b/events' },
  { label: 'Analytics', icon: BarChart3, href: '/b2b/analytics' },
  { label: 'Rapports', icon: FileText, href: '/b2b/reports' },
  { label: 'Alertes', icon: AlertTriangle, href: '/b2b/alerts', badge: '3' },
  { label: 'Optimisation', icon: Zap, href: '/b2b/optimisation', requiresManager: true },
  { label: 'Audit', icon: Shield, href: '/b2b/audit', requiresAdmin: true },
  { label: 'Sécurité', icon: Shield, href: '/b2b/security', requiresAdmin: true },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: 'Paramètres', icon: Settings, href: '/b2b/settings' },
  { label: 'Aide', icon: HelpCircle, href: '/help' },
];

interface B2BLayoutProps {
  children?: React.ReactNode;
}

export const B2BLayout: React.FC<B2BLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { role, isAdmin, isManager, canManageTeams } = useB2BRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const orgName = (user?.user_metadata?.org_name as string) || 'Organisation';
  const userInitials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  const isActiveRoute = (href: string) => {
    if (href === '/b2b') return location.pathname === '/b2b';
    return location.pathname.startsWith(href);
  };

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.requiresAdmin && !isAdmin) return false;
    if (item.requiresManager && !isManager) return false;
    return true;
  });

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActiveRoute(item.href);
    const Icon = item.icon;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                'hover:bg-accent hover:text-accent-foreground',
                active && 'bg-primary/10 text-primary font-medium',
                collapsed && 'justify-center'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    );
  };

  const Sidebar = () => (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300',
        'flex flex-col',
        collapsed ? 'w-16' : 'w-64',
        'hidden lg:flex'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">B2B</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && 'mx-auto')}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Org info */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {orgName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{orgName}</p>
              <Badge variant="outline" className="text-xs">
                {role || 'Membre'}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredNavItems.map(item => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom nav */}
      <div className="px-3 py-4 border-t space-y-1">
        {BOTTOM_NAV_ITEMS.map(item => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>

      {/* User */}
      <div className="p-4 border-t">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  const MobileHeader = () => (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-bold">B2B</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/notifications"><Bell className="h-5 w-5" /></Link>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b shadow-lg p-4">
          <nav className="space-y-1">
            {filteredNavItems.map(item => (
              <NavLink key={item.href} item={item} />
            ))}
            <Separator className="my-2" />
            {BOTTOM_NAV_ITEMS.map(item => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileHeader />

      {/* Main content */}
      <main
        className={cn(
          'transition-all duration-300',
          'lg:ml-64 pt-16 lg:pt-0',
          collapsed && 'lg:ml-16'
        )}
      >
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default B2BLayout;
