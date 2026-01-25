import { Home, Heart, Gamepad2, Users, BarChart3, Settings, Music, Brain, BookOpen, Sparkles, MessageCircle, Calendar, FileText, Download, ChevronDown, BookText } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const navigationItems = [
  {
    category: 'Principal',
    items: [
      { title: 'Dashboard Modules', url: '/app/modules', icon: Home },
      { title: 'Scan Émotionnel', url: '/app/scan', icon: Sparkles },
      { title: 'Musique Adaptative', url: '/app/music', icon: Music },
      { title: 'Coach IA', url: '/app/coach', icon: Brain },
      { 
        title: 'Journal', 
        url: '/app/journal', 
        icon: BookOpen,
        subItems: [
          { title: 'Mes entrées', url: '/app/journal', icon: BookOpen },
          { title: 'Nouvelle entrée', url: '/app/journal-new', icon: BookText },
          { title: 'Paramètres', url: '/settings/journal', icon: Settings },
        ]
      },
    ],
  },
  {
    category: 'Bien-être',
    items: [
      { title: 'Respiration', url: '/app/breath', icon: Heart },
      { title: 'VR Galaxy', url: '/app/vr', icon: Sparkles },
      { title: 'Cocon Nyvee', url: '/app/nyvee', icon: Heart },
    ],
  },
  {
    category: 'Jeux Fun-First',
    items: [
      { title: 'Flash & Glow', url: '/app/flash-glow', icon: Gamepad2 },
      { title: 'Filtres AR', url: '/app/face-ar', icon: Gamepad2 },
      { title: 'Bubble Beat', url: '/app/bubble-beat', icon: Gamepad2 },
      { title: 'Boss Grit', url: '/app/boss-grit', icon: Gamepad2 },
      { title: 'Mood Mixer', url: '/app/mood-mixer', icon: Gamepad2 },
    ],
  },
  {
    category: 'Social',
    items: [
      { title: 'Communauté', url: '/app/community', icon: Users },
      { title: 'Classements', url: '/app/leaderboard', icon: BarChart3 },
      { title: 'Messages', url: '/messages', icon: MessageCircle },
    ],
  },
  {
    category: 'Analytics',
    items: [
      { title: 'Activité', url: '/app/activity', icon: BarChart3 },
      { title: 'Heatmap', url: '/app/scores', icon: BarChart3 },
      { title: 'Gamification', url: '/gamification', icon: Sparkles },
    ],
  },
  {
    category: 'Outils',
    items: [
      { title: 'Calendrier', url: '/calendar', icon: Calendar },
      { title: 'Reporting', url: '/reporting', icon: FileText },
      { title: 'Export', url: '/export', icon: Download },
    ],
  },
  {
    category: 'Configuration',
    items: [
      { title: 'Paramètres', url: '/settings/general', icon: Settings },
      { title: 'Profil', url: '/settings/profile', icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const _isActive = (path: string) => currentPath === path;
  
  const toggleItem = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-accent text-accent-foreground font-medium'
      : 'hover:bg-accent/50 hover:text-accent-foreground';

  return (
    <Sidebar className={open ? 'w-60' : 'w-14'} collapsible="icon">
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.category}>
            {open && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4 py-2">
                {section.category}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const hasSubItems = 'subItems' in item && item.subItems && item.subItems.length > 0;
                  
                  if (hasSubItems) {
                    return (
                      <Collapsible
                        key={item.title}
                        open={expandedItems.includes(item.title)}
                        onOpenChange={() => toggleItem(item.title)}
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className={getNavCls({ isActive: currentPath.startsWith('/app/journal') || currentPath.startsWith('/settings/journal') })}>
                              <item.icon className="h-4 w-4 shrink-0" />
                              {open && (
                                <>
                                  <span className="ml-3 flex-1">{item.title}</span>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedItems.includes(item.title) ? 'rotate-180' : ''}`} />
                                </>
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          {open && (
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.subItems.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <NavLink to={subItem.url} className={getNavCls}>
                                        <subItem.icon className="h-4 w-4 shrink-0" />
                                        <span className="ml-3">{subItem.title}</span>
                                      </NavLink>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          )}
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} end className={getNavCls}>
                          <item.icon className="h-4 w-4 shrink-0" />
                          {open && <span className="ml-3">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
