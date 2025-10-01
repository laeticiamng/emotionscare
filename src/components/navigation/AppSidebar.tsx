// @ts-nocheck
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Users, BarChart3, MessageSquare, 
  Brain, Music, Zap, BookOpen, Heart,
  Activity, Calendar, Award, Settings,
  HelpCircle, Target, Gamepad2, Wind,
  Sparkles, Star, TrendingUp, Crown
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const AppSidebar = () => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  // Navigation selon le rôle
  const getMainNavigation = () => {
    const role = user?.role || 'b2c';
    
    const baseItems = [
      { title: 'Accueil', url: role === 'b2c' ? '/app/home' : role === 'b2b_user' ? '/app/collab' : '/app/rh', icon: Home }
    ];

    if (role === 'b2c') {
      baseItems.push(
        { title: 'Social B2C', url: '/app/social-b2c', icon: MessageSquare, badge: 'Nouveau' }
      );
    } else if (role === 'b2b_user') {
      baseItems.push(
        { title: 'Collab', url: '/app/collab', icon: Users },
        { title: 'Espace Perso', url: '/app/home', icon: Heart }
      );
    } else if (role === 'b2b_rh') {
      baseItems.push(
        { title: 'Dashboard RH', url: '/app/rh', icon: BarChart3 },
        { title: 'Collab', url: '/app/collab', icon: Users },
        { title: 'Espace Perso', url: '/app/home', icon: Heart }
      );
    }

    return baseItems;
  };

  // Modules personnels (disponibles pour tous)
  const personalModules = [
    { title: 'Scan Émotionnel', url: '/app/scan', icon: Brain, shortDesc: 'État instantané' },
    { title: 'Musicothérapie', url: '/app/music', icon: Music, shortDesc: 'Ambiance adaptée' },
    { title: 'Flash Glow', url: '/app/flash-glow', icon: Zap, shortDesc: 'Boost express' },
    { title: 'Journal', url: '/app/journal', icon: BookOpen, shortDesc: 'Exutoire privé' },
    { title: 'Mood Mixer', url: '/app/mood-mixer', icon: Sparkles, shortDesc: 'Vibe sur mesure' },
    { title: 'Respiration', url: '/app/breathing', icon: Wind, shortDesc: 'Calme profond' },
    { title: 'VR Galaxy', url: '/app/vr-breathing', icon: Star, shortDesc: 'Immersion totale' },
    { title: 'Bubble Beat', url: '/app/bubble-beat', icon: Gamepad2, shortDesc: 'Jeu anti-stress' },
    { title: 'Coach 1-min', url: '/app/coach', icon: Target, shortDesc: 'Conseil express' },
    { title: 'Boss Grit', url: '/app/boss-grit', icon: Award, shortDesc: 'Défis bienveillants' },
    { title: 'Story Synth', url: '/app/story-synth', icon: BookOpen, shortDesc: 'Histoires apaisantes' },
    { title: 'Ambition Arcade', url: '/app/ambition-arcade', icon: Crown, shortDesc: 'Objectifs gamifiés' }
  ];

  // Suivi & analyse
  const trackingItems = [
    { title: 'Mon Activité', url: '/app/activity', icon: Activity, shortDesc: 'Historique privé' },
    { title: 'Weekly Recap', url: '/app/weekly-recap', icon: Calendar, shortDesc: 'Synthèse hebdo' },
    { title: 'Screen Silk', url: '/app/screen-silk', icon: TrendingUp, shortDesc: 'Pause visuelle' },
    { title: 'Leaderboard', url: '/app/leaderboard', icon: Crown, shortDesc: 'Communauté' }
  ];

  // Pages utilitaires
  const utilityItems = [
    { title: 'Profil', url: '/profile', icon: Settings },
    { title: 'Paramètres', url: '/settings', icon: Settings },
    { title: 'Aide', url: '/help', icon: HelpCircle }
  ];

  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 w-full text-left transition-all duration-200";
    return isActive(path) 
      ? `${baseClasses} bg-primary text-primary-foreground font-medium shadow-md` 
      : `${baseClasses} hover:bg-muted/80 text-muted-foreground hover:text-foreground`;
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-72"} collapsible>
      <SidebarContent className="bg-card/50 backdrop-blur-sm border-r">
        {/* Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                EmotionsCare
              </span>
            )}
          </div>
        </div>

        {/* Navigation principale */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMainNavigation().map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1">
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Modules personnels */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Modules Bien-être
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {personalModules.map((module) => (
                <SidebarMenuItem key={module.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={module.url} className={getNavClasses(module.url)}>
                      <module.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{module.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {module.shortDesc}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Suivi & Analyse */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Suivi & Analyse
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {trackingItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.shortDesc}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Utilitaires */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Status */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {user?.email?.split('@')[0] || 'Utilisateur'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.role === 'b2c' && 'Particulier'}
                  {user?.role === 'b2b_user' && 'Employé'}
                  {user?.role === 'b2b_rh' && 'RH Manager'}
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };