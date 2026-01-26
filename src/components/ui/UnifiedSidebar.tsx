/**
 * UNIFIED SIDEBAR SYSTEM - Production Ready
 * Consolidates all sidebar implementations into one premium component
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarProvider
} from '@/components/ui/sidebar';
import { 
  Home, 
  Scan, 
  Music, 
  Brain, 
  Users, 
  Settings, 
  BarChart3,
  Shield,
  FileText,
  Eye,
  Activity,
  Zap,
  Heart,
  Gamepad2,
  Wind,
  Trophy,
  Target,
  Timer,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { logProductionEvent } from '@/utils/consoleCleanup';

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  roles?: string[];
  featureFlag?: string;
  disabled?: boolean;
}

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
  defaultOpen?: boolean;
  roles?: string[];
}

// Unified navigation structure
const navigationGroups: NavigationGroup[] = [
  {
    label: 'Principal',
    defaultOpen: true,
    items: [
      { title: 'Accueil', url: '/app/home', icon: Home, description: 'Tableau de bord principal' },
      { title: 'Scanner Émotions', url: '/app/scan', icon: Scan, description: 'Analysez vos émotions' },
      { title: 'Journal', url: '/app/journal', icon: FileText, description: 'Votre journal personnel' },
      { title: 'Coach IA', url: '/app/coach', icon: Brain, description: 'Accompagnement personnalisé' }
    ]
  },
  {
    label: 'Bien-être',
    items: [
      { title: 'Respiration', url: '/app/breath', icon: Wind, description: 'Exercices de respiration' },
      { title: 'Musique', url: '/app/music', icon: Music, badge: 'Premium', description: 'Musique thérapeutique' },
      { title: 'Méditation VR', url: '/app/vr-breath-guide', icon: Eye, featureFlag: 'FF_VR', description: 'Réalité virtuelle' },
      { title: 'Activités', url: '/app/activity', icon: Activity, description: 'Activités bien-être' }
    ]
  },
  {
    label: 'Jeux & Défis',
    items: [
      { title: 'Gamification', url: '/app/gamification', icon: Gamepad2, description: 'Jeux thérapeutiques' },
      { title: 'Flash Glow', url: '/app/flash-glow', icon: Zap, description: 'Jeu de lumière' },
      { title: 'Bubble Beat', url: '/app/bubble-beat', icon: Heart, description: 'Rythme cardiaque' },
      { title: 'Boss Grit', url: '/app/boss-grit', icon: Target, description: 'Défi de résilience' },
      { title: 'Ambition Arcade', url: '/app/ambition-arcade', icon: Trophy, description: 'Jeux d\'ambition' }
    ]
  },
  {
    label: 'Social',
    roles: ['employee', 'manager'],
    items: [
      { title: 'Équipes', url: '/app/teams', icon: Users, description: 'Collaboration équipe' },
      { title: 'Social Cocon', url: '/app/social-cocon', icon: Users, description: 'Espace social' },
      { title: 'Communauté', url: '/app/community', icon: Globe, featureFlag: 'FF_COMMUNITY' }
    ]
  },
  {
    label: 'Management',
    roles: ['manager'],
    items: [
      { title: 'RH Dashboard', url: '/app/rh', icon: BarChart3, featureFlag: 'FF_MANAGER_DASH' },
      { title: 'Rapports', url: '/app/reports', icon: FileText, description: 'Analyses détaillées' },
      { title: 'Événements', url: '/app/events', icon: Timer, description: 'Gestion événements' },
      { title: 'Optimisation', url: '/app/optimization', icon: TrendingUp, description: 'Amélioration continue' }
    ]
  },
  {
    label: 'Administration',
    roles: ['manager'],
    items: [
      { title: 'Sécurité', url: '/app/security', icon: Shield, description: 'Monitoring sécurité' },
      { title: 'Audit', url: '/app/audit', icon: CheckCircle, description: 'Conformité & logs' },
      { title: 'Accessibilité', url: '/app/accessibility', icon: Eye, description: 'Tests WCAG' },
      { title: 'API Monitoring', url: '/system/api-monitoring', icon: Activity, description: 'Performance APIs' }
    ]
  },
  {
    label: 'Paramètres',
    items: [
      { title: 'Général', url: '/settings/general', icon: Settings, description: 'Configuration' },
      { title: 'Profil', url: '/settings/profile', icon: Users, description: 'Votre profil' },
      { title: 'Confidentialité', url: '/settings/privacy', icon: Lock, description: 'Vie privée' },
      { title: 'Notifications', url: '/settings/notifications', icon: AlertTriangle, description: 'Alertes' }
    ]
  }
];

interface UnifiedSidebarProps {
  userRole?: string;
  className?: string;
  enabledFeatures?: string[];
}

/**
 * Unified Sidebar Component - All sidebar functionality in one place
 */
const UnifiedSidebar: React.FC<UnifiedSidebarProps> = memo(({ 
  userRole = 'consumer', 
  className,
  enabledFeatures = []
}) => {
  const { open } = useSidebar();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Principal']));

  // Announce to screen reader
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  // Filter navigation based on user role and feature flags
  const filteredGroups = navigationGroups.filter(group => {
    if (group.roles && !group.roles.includes(userRole)) {
      return false;
    }
    return true;
  }).map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.roles && !item.roles.includes(userRole)) {
        return false;
      }
      if (item.featureFlag && !enabledFeatures.includes(item.featureFlag)) {
        return false;
      }
      if (item.disabled) {
        return false;
      }
      return true;
    })
  })).filter(group => group.items.length > 0);

  // Auto-expand group containing active route
  useEffect(() => {
    const activeGroup = filteredGroups.find(group =>
      group.items.some(item => location.pathname === item.url)
    );
    
    if (activeGroup) {
      setExpandedGroups(prev => new Set([...prev, activeGroup.label]));
    }
  }, [location.pathname, filteredGroups]);

  // Handle group toggle
  const toggleGroup = useCallback((groupLabel: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupLabel)) {
        newSet.delete(groupLabel);
      } else {
        newSet.add(groupLabel);
      }
      return newSet;
    });
  }, []);

  // Handle navigation
  const handleNavigation = useCallback((item: NavigationItem) => {
    announceToScreenReader(`Navigation vers ${item.title}`);
    logProductionEvent('Navigation', { 
      from: location.pathname, 
      to: item.url, 
      title: item.title 
    });
  }, [location.pathname, announceToScreenReader]);

  // Check if route is active
  const isActive = useCallback((url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  }, [location.pathname]);

  // Get navigation classes
  const getNavClasses = useCallback((item: NavigationItem) => {
    const active = isActive(item.url);
    return cn(
      'w-full justify-start transition-all duration-200',
      active && 'bg-primary/10 text-primary font-medium border-r-2 border-primary',
      !active && 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
      item.disabled && 'opacity-50 cursor-not-allowed'
    );
  }, [isActive]);

  return (
    <Sidebar className={cn('border-r bg-card', className)} collapsible="icon">
      {/* Mobile trigger - always visible */}
      <div className="p-2 border-b lg:hidden">
        <SidebarTrigger 
          className="h-10 w-10"
          aria-label="Toggle navigation menu"
        />
      </div>

      <SidebarContent className="p-4">
        {filteredGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          
          return (
          <SidebarGroup 
            key={group.label}
          >
              <SidebarGroupLabel 
                className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => toggleGroup(group.label)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`group-${group.label}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleGroup(group.label);
                  }
                }}
              >
                <span>{group.label}</span>
                <span className={cn(
                  'transition-transform duration-200',
                  isExpanded ? 'rotate-90' : 'rotate-0'
                )}>
                  ▶
                </span>
              </SidebarGroupLabel>

              <SidebarGroupContent 
                id={`group-${group.label}`}
                className={cn(
                  'transition-all duration-200 overflow-hidden',
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <SidebarMenu className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        className={getNavClasses(item)}
                        disabled={item.disabled}
                      >
                        <NavLink
                          to={item.url}
                          onClick={() => handleNavigation(item)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md group"
                          aria-label={`${item.title}${item.description ? ` - ${item.description}` : ''}`}
                          title={item.description}
                        >
                          <item.icon 
                            className={cn(
                              'h-4 w-4 shrink-0 transition-colors',
                              isActive(item.url) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                            )} 
                            aria-hidden="true"
                          />
                          
                          {open && (
                            <>
                              <span className="flex-1 text-sm font-medium">
                                {item.title}
                              </span>
                              
                              {item.badge && (
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs"
                                  aria-label={`Badge: ${item.badge}`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        {/* Sidebar footer */}
        {open && (
          <div className="mt-auto pt-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              <p>EmotionsCare v2.0</p>
              <p>Plateforme Premium</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
});

UnifiedSidebar.displayName = 'UnifiedSidebar';

/**
 * Unified Sidebar Provider - Wraps the entire app
 */
export const UnifiedSidebarProvider: React.FC<{ 
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}> = ({ children, defaultCollapsed = false }) => {
  return (
    <SidebarProvider 
      defaultOpen={!defaultCollapsed}
    >
      <div className="min-h-screen flex w-full">
        {children}
      </div>
    </SidebarProvider>
  );
};

export default UnifiedSidebar;