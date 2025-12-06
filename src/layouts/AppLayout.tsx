// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { routes } from '@/routerV2';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/providers/theme';
import {
  Loader2,
  Menu,
  X,
  Heart, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Home,
  Camera,
  Music,
  Brain,
  BookOpen,
  Activity,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import HealthCheckBadge from '@/components/HealthCheckBadge';

// Enhanced layout component with premium sidebar and navigation
const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user, signOut } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    // Close sidebar on route change (mobile)
    setSidebarOpen(false);
  }, [location.pathname]);

  // Navigation items with enhanced structure
  const navigationItems = [
    { 
      label: 'Dashboard', 
      href: '/app/home', 
      icon: Home,
      description: 'Vue d\'ensemble de votre bien-être',
      badge: null
    },
    { 
      label: 'Scanner Émotions', 
      href: '/app/scan', 
      icon: Camera,
      description: 'Analyse faciale en temps réel',
      badge: 'IA'
    },
    { 
      label: 'Thérapie Musicale', 
      href: '/app/music', 
      icon: Music,
      description: 'Musique personnalisée par IA',
      badge: 'Premium'
    },
    { 
      label: 'Coach IA', 
      href: '/app/coach', 
      icon: Brain,
      description: 'Accompagnement personnalisé Nyvée',
      badge: 'IA'
    },
    { 
      label: 'Journal', 
      href: '/app/journal', 
      icon: BookOpen,
      description: 'Espace privé pour vos réflexions',
      badge: null
    },
    { 
      label: 'Activité', 
      href: '/app/activity', 
      icon: Activity,
      description: 'Suivi de vos progrès',
      badge: null
    },
    { 
      label: 'VR Thérapie', 
      href: '/app/vr-breath', 
      icon: Headphones,
      description: 'Immersion thérapeutique',
      badge: 'VR'
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/app/home') return location.pathname === '/app/home' || location.pathname === '/app';
    return location.pathname.startsWith(href);
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      logger.error('Erreur lors de la déconnexion', error as Error, 'AUTH');
    }
  };

  // Show enhanced loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <h2 className="text-xl font-semibold">EmotionsCare</h2>
            <p className="text-muted-foreground">Chargement de votre espace personnel...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={routes.auth.login()} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background/95 backdrop-blur-md border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link 
              to="/app/home" 
              className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                EmotionsCare
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group',
                  isActiveRoute(item.href)
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
                  isActiveRoute(item.href)
                    ? 'bg-primary/10'
                    : 'bg-muted/50 group-hover:bg-muted'
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t bg-muted/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start space-x-3 p-3 h-auto">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm truncate">
                      {user?.user_metadata?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings/general">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <Link to="/app/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">EmotionsCare</span>
            </Link>

            <div className="flex items-center space-x-2">
              <HealthCheckBadge />
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {notifications}
                  </Badge>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/settings/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings/general">Paramètres</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen" role="main">
          <div className="hidden lg:flex justify-end px-6 py-4 border-b bg-background/80 backdrop-blur-md">
            <HealthCheckBadge />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  );
};

export default AppLayout;
