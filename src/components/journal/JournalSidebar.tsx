import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
import {
  BookOpen,
  PenLine,
  Search,
  BarChart3,
  Settings,
  Archive,
  Star,
  Calendar,
  Target,
} from 'lucide-react';

interface JournalSidebarProps {
  basePath?: string;
}

/**
 * Sidebar de navigation pour le module Journal
 * Intègre toutes les sections du journal
 */
export const JournalSidebar = memo<JournalSidebarProps>(({ basePath = '/journal' }) => {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

  const mainItems = [
    { title: 'Écrire', url: `${basePath}`, icon: PenLine, exact: true },
    { title: 'Mes notes', url: `${basePath}/notes`, icon: BookOpen },
    { title: 'Favoris', url: `${basePath}/favorites`, icon: Star },
    { title: 'Recherche', url: `${basePath}/search`, icon: Search },
  ];

  const analyticsItems = [
    { title: 'Dashboard', url: `${basePath}/analytics`, icon: BarChart3 },
    { title: 'Activité', url: `${basePath}/activity`, icon: Calendar },
    { title: 'Objectifs', url: `${basePath}/goals`, icon: Target },
  ];

  const settingsItems = [
    { title: 'Archive', url: `${basePath}/archive`, icon: Archive },
    { title: 'Paramètres', url: `${basePath}/settings`, icon: Settings },
  ];

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return active
      ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
      : 'hover:bg-muted';
  };

  return (
    <Sidebar className={open ? 'w-60' : 'w-14'} collapsible="icon">
      <SidebarContent>
        {/* Section principale */}
        <SidebarGroup>
          <SidebarGroupLabel>Journal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.exact}
                      className={getNavClass(item.url)}
                    >
                      <item.icon className={open ? 'mr-2 h-4 w-4' : 'h-4 w-4'} aria-hidden="true" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Analytics */}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className={open ? 'mr-2 h-4 w-4' : 'h-4 w-4'} aria-hidden="true" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Paramètres */}
        <SidebarGroup>
          <SidebarGroupLabel>Plus</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className={open ? 'mr-2 h-4 w-4' : 'h-4 w-4'} aria-hidden="true" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
});

JournalSidebar.displayName = 'JournalSidebar';
