// @ts-nocheck
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Brain,
  Music,
  MessageSquare,
  BookOpen,
  Scan,
  Sparkles,
  Gamepad2,
  Users,
  BarChart3,
  Settings,
  Home,
  Zap,
  Target,
  Wind,
  Palette,
  Trophy,
  Shield,
  FileText,
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
import { routes } from '@/lib/routes';

const coreModules = [
  { title: 'Dashboard', url: routes.b2c.dashboard(), icon: Home },
  { title: 'Scan Émotionnel', url: routes.b2c.scan(), icon: Scan },
  { title: 'Musique Adaptative', url: routes.b2c.music(), icon: Music },
  { title: 'AI Coach', url: routes.b2c.coach(), icon: MessageSquare },
  { title: 'Journal', url: routes.b2c.journal(), icon: BookOpen },
  { title: 'Sessions Émotionnelles', url: routes.b2c.emotionSessions(), icon: Sparkles },
];

const wellnessModules = [
  { title: 'Respiration', url: routes.b2c.breath(), icon: Wind },
  { title: 'VR Galaxy', url: routes.b2c.vrGalaxy(), icon: Brain },
  { title: 'Flash Glow', url: routes.b2c.flashGlow(), icon: Zap },
];

const gamificationModules = [
  { title: 'Mood Mixer', url: routes.b2c.moodMixer(), icon: Palette },
  { title: 'Boss Grit', url: routes.b2c.bossLevel(), icon: Target },
  { title: 'Bounce Back', url: routes.b2c.bounceBack(), icon: Shield },
  { title: 'Bubble Beat', url: routes.b2c.bubbleBeat(), icon: Gamepad2 },
  { title: 'Story Synth', url: routes.b2c.storySynth(), icon: Sparkles },
];

const socialModules = [
  { title: 'Communauté', url: routes.b2c.community(), icon: Users },
  { title: 'Social Cocon', url: routes.b2c.socialCocon(), icon: Users },
  { title: 'Leaderboard', url: routes.b2c.leaderboard(), icon: Trophy },
];

const analyticsModules = [
  { title: 'Analytics', url: routes.b2c.activity(), icon: BarChart3 },
  { title: 'Heatmap', url: routes.b2c.heatmap(), icon: BarChart3 },
  { title: 'Gamification', url: routes.b2c.gamification(), icon: Trophy },
];

const settingsModules = [
  { title: 'Paramètres', url: routes.b2c.settings(), icon: Settings },
  { title: 'Profil', url: routes.b2c.profile(), icon: FileText },
];

const adminModules = [
  { title: 'Gestion des Rôles', url: routes.b2b.admin.userRoles(), icon: Shield },
  { title: 'Queue Musicale', url: routes.b2b.admin.musicQueue(), icon: Music },
  { title: 'Métriques Musique', url: routes.b2b.admin.musicMetrics(), icon: BarChart3 },
];

export function AppSidebar() {
  const { state, open, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const collapsed = state === 'collapsed' || !open;

  const isActive = (url: string) => currentPath === url || currentPath.startsWith(url);

  const getNavCls = (active: boolean) =>
    active
      ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary'
      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors';

  // Ferme le sidebar mobile après navigation
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      className={collapsed ? 'w-16' : 'w-64'}
      collapsible
    >
      <SidebarContent className="py-4">
        {/* Core Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'px-2' : ''}>
            {!collapsed && 'Modules Principaux'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) => getNavCls(isActive)}
                      onClick={handleLinkClick}
                    >
                      <item.icon className={collapsed ? 'h-5 w-5' : 'mr-3 h-5 w-5'} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Wellness Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'px-2' : ''}>
            {!collapsed && 'Bien-être'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {wellnessModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => getNavCls(isActive)}
                      onClick={handleLinkClick}
                    >
                      <item.icon className={collapsed ? 'h-5 w-5' : 'mr-3 h-5 w-5'} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Gamification */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'px-2' : ''}>
            {!collapsed && 'Jeux Fun-First'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gamificationModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => getNavCls(isActive)}
                      onClick={handleLinkClick}
                    >
                      <item.icon className={collapsed ? 'h-5 w-5' : 'mr-3 h-5 w-5'} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Social */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'px-2' : ''}>
            {!collapsed && 'Social'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {socialModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => getNavCls(isActive)}
                      onClick={handleLinkClick}
                    >
                      <item.icon className={collapsed ? 'h-5 w-5' : 'mr-3 h-5 w-5'} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analytics */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'px-2' : ''}>
            {!collapsed && 'Analytics'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => getNavCls(isActive)}
                      onClick={handleLinkClick}
                    >
                      <item.icon className={collapsed ? 'h-5 w-5' : 'mr-3 h-5 w-5'} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'px-2' : ''}>
            {!collapsed && 'Configuration'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => getNavCls(isActive)}
                      onClick={handleLinkClick}
                    >
                      <item.icon className={collapsed ? 'h-5 w-5' : 'mr-3 h-5 w-5'} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Tools (conditionally rendered) */}
        {currentPath.includes('/admin') && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? 'px-2' : ''}>
              {!collapsed && 'Administration'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminModules.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) => getNavCls(isActive)}
                        onClick={handleLinkClick}
                      >
                        <item.icon className={collapsed ? 'h-5 w-5' : 'mr-3 h-5 w-5'} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
