/**
 * APP LAYOUT PREMIUM - EMOTIONSCARE
 * Layout principal avec sidebar, navigation et protection d'accès
 */

import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Menu, 
  X, 
  Home,
  Camera,
  Music,
  Brain,
  BookOpen,
  Activity,
  Settings,
  HelpCircle,
  User,
  ChevronRight,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/app/home',
    icon: Home,
    description: 'Vue d\'ensemble de votre bien-être'
  },
  {
    label: 'Scanner Émotionnel',
    href: '/app/scan',
    icon: Camera,
    badge: 'IA',
    description: 'Analyse en temps réel de vos émotions',
    children: [
      { label: 'Scan Facial', href: '/app/scan/facial', icon: Camera },
      { label: 'Analyse Vocale', href: '/app/scan/voice', icon: Camera },
      { label: 'Analyse Textuelle', href: '/app/scan/text', icon: Camera }
    ]
  },
  {
    label: 'Coach IA Nyvée',
    href: '/app/coach',
    icon: Brain,
    badge: 'Premium',
    description: 'Votre coach personnel en bien-être'
  },
  {
    label: 'Musique Thérapeutique',
    href: '/app/music',
    icon: Music,
    badge: 'Suno',
    description: 'Compositions générées selon vos émotions'
  },
  {
    label: 'Journal Émotionnel',
    href: '/app/journal',
    icon: BookOpen,
    description: 'Espace privé pour vos réflexions'
  },
  {
    label: 'Exercices de Bien-être',
    href: '/app/wellbeing',
    icon: Activity,
    description: 'Respiration, méditation, relaxation',
    children: [
      { label: 'Respiration Guidée', href: '/app/breath', icon: Activity },
      { label: 'VR Thérapie', href: '/app/vr-breath', icon: Activity },
      { label: 'Méditation', href: '/app/meditation', icon: Activity }
    ]
  },
  {
    label: 'Paramètres',
    href: '/app/settings',
    icon: Settings,
    description: 'Configuration et préférences'
  },
  {
    label: 'Aide',
    href: '/help',
    icon: HelpCircle,
    description: 'Support et documentation'
  }
];

const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="app-loading">
        <div className="text-center space-y-4">
          <LoadingSpinner size="xl" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Chargement de votre espace...</h2>
            <p className="text-sm text-muted-foreground">Vérification de votre authentification</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isActiveRoute = (href: string) => {
    if (href === '/app/home') return location.pathname === '/app/home' || location.pathname === '/app';
    return location.pathname.startsWith(href);
  };

  const toggleExpanded = (href: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex" data-testid="app-layout">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'fixed lg:static top-0 left-0 h-full w-80 bg-background border-r border-border z-50',
          'lg:translate-x-0 lg:block flex flex-col'
        )}
        aria-label="Navigation principale"
        id="primary-navigation"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <Link to="/app/home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  EmotionsCare
                </h1>
                <Badge variant="secondary" className="text-xs">Premium</Badge>
              </div>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.user_metadata?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto" role="navigation">
          <ul className="space-y-2" role="list">
            {sidebarItems.map((item) => (
              <li key={item.href} role="listitem">
                <div>
                  <Link
                    to={item.href}
                    onClick={closeSidebar}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg transition-all text-sm group hover:bg-muted/50',
                      isActiveRoute(item.href) 
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 transition-transform group-hover:scale-110',
                      isActiveRoute(item.href) ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="outline" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground/80 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {item.children && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpanded(item.href);
                        }}
                      >
                        <ChevronRight 
                          className={cn(
                            'w-4 h-4 transition-transform',
                            expandedItems.has(item.href) && 'rotate-90'
                          )} 
                        />
                      </Button>
                    )}
                  </Link>

                  {/* Sous-menu */}
                  <AnimatePresence>
                    {item.children && expandedItems.has(item.href) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-8 mt-1 space-y-1"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={closeSidebar}
                            className={cn(
                              'flex items-center gap-2 p-2 rounded text-sm transition-colors hover:bg-muted/50',
                              isActiveRoute(child.href) 
                                ? 'text-primary bg-primary/5' 
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 mx-auto text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Premium Active</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Accès illimité à toutes les fonctionnalités
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Gérer l'abonnement
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-background border-b border-border p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/app/home" className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">EmotionsCare</span>
          </Link>
          
          <div className="w-8" /> {/* Spacer pour centrer le logo */}
        </div>

        {/* Page Content */}
        <main className="flex-1" role="main" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;