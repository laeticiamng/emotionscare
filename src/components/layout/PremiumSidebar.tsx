/**
 * Premium Sidebar - Sidebar premium avec navigation intelligente
 * Navigation latérale adaptative pour l'application
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  Scan,
  BookOpen,
  Bot,
  Music,
  Gamepad2,
  Zap,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
  Activity,
  VolumeX,
  Crown,
  Shield,
  Brain,
  Headphones,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface PremiumSidebarProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
  premium?: boolean;
  roles?: string[];
  category?: string;
}

export const PremiumSidebar: React.FC<PremiumSidebarProps> = ({
  open = true,
  onClose,
  className
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Navigation items organized by category
  const navigationItems: NavItem[] = [
    // Core Features
    { icon: Home, label: 'Accueil', href: '/app/home', category: 'core' },
    { icon: Scan, label: 'Scanner Émotions', href: '/app/scan', category: 'core' },
    { icon: BookOpen, label: 'Journal', href: '/app/journal', category: 'core' },
    { icon: Bot, label: 'Coach IA', href: '/app/coach', badge: 'IA', category: 'core' },
    
    // Wellness & Activities
    { icon: Heart, label: 'Respiration', href: '/app/breath', category: 'wellness' },
    { icon: Activity, label: 'Activités', href: '/app/activity', category: 'wellness' },
    { icon: Music, label: 'Thérapie Musicale', href: '/app/music', premium: true, category: 'wellness' },
    
    // Gaming & Entertainment
    { icon: Gamepad2, label: 'Jeux Thérapeutiques', href: '/app/games', category: 'games' },
    { icon: Zap, label: 'VR Expériences', href: '/app/vr', premium: true, category: 'games' },
    { icon: Target, label: 'Défis Boss', href: '/app/boss-grit', category: 'games' },
    
    // Social & Collaboration
    { icon: Users, label: 'Social', href: '/app/social', roles: ['employee', 'manager'], category: 'social' },
    { icon: Users, label: 'Équipes', href: '/app/teams', roles: ['employee', 'manager'], category: 'social' },
    { icon: Users, label: 'Collaboration', href: '/app/collab', roles: ['employee', 'manager'], category: 'social' },
    
    // Management
    { icon: BarChart3, label: 'RH Dashboard', href: '/app/rh', roles: ['manager'], category: 'management' },
    { icon: BarChart3, label: 'Rapports', href: '/app/reports', roles: ['manager'], category: 'management' },
    { icon: Shield, label: 'Sécurité', href: '/app/security', roles: ['manager'], category: 'management' },
    
    // Settings
    { icon: Settings, label: 'Paramètres', href: '/settings', category: 'system' },
  ];

  // Filter items based on user role
  const filteredItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || 'consumer');
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const categoryLabels = {
    core: 'Fonctionnalités Principales',
    wellness: 'Bien-être & Santé',
    games: 'Jeux & Divertissement',
    social: 'Social & Équipes',
    management: 'Gestion & Analyse',
    system: 'Système'
  };

  const isActiveRoute = (href: string) => {
    if (href === '/app/home') {
      return location.pathname === '/app/home' || location.pathname === '/app';
    }
    return location.pathname.startsWith(href);
  };

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sidebarContent = (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">EmotionsCare</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-8 h-8 p-0"
          aria-label={collapsed ? 'Développer le menu' : 'Réduire le menu'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1" role="navigation">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            {!collapsed && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {categoryLabels[category as keyof typeof categoryLabels] || category}
                </h3>
              </div>
            )}
            
            <div className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isActiveRoute(item.href)
                      ? "bg-primary/10 text-primary border-r-2 border-primary"
                      : "text-muted-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    item.premium && "text-yellow-500"
                  )} />
                  
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      
                      <div className="flex items-center space-x-1">
                        {item.premium && (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        )}
                        
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </Link>
              ))}
            </div>
            
            {!collapsed && <Separator className="my-2" />}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Système opérationnel</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Version 2.0 Premium
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={cn(
          "hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] z-30",
          className
        )}
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className={cn(
              "md:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] z-50",
              className
            )}
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default PremiumSidebar;