import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  BarChart3,
  Settings,
  Heart,
  Calendar,
  Shield,
  FileText,
  Activity,
  UserCog,
  Globe,
  Zap,
  Database,
  DollarSign
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath }) => {
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Vue d\'ensemble',
      href: '/app/rh',
      icon: BarChart3,
      description: 'Dashboard principal'
    },
    {
      title: 'Gestion des équipes',
      href: '/app/teams',
      icon: Users,
      description: 'Équipes et collaborateurs'
    },
    {
      title: 'Analyses émotionnelles',
      href: '/app/analytics',
      icon: Heart,
      description: 'Bien-être des équipes'
    },
    {
      title: 'Rapports avancés',
      href: '/app/reports',
      icon: FileText,
      description: 'Rapports et exports'
    },
    {
      title: 'Journal d\'activité',
      href: '/app/activity',
      icon: Activity,
      description: 'Logs et audit'
    },
    {
      title: 'Événements',
      href: '/app/events',
      icon: Calendar,
      description: 'Événements d\'entreprise'
    },
    {
      title: 'Social Cocon',
      href: '/app/social-cocon',
      icon: Globe,
      description: 'Groupes sociaux'
    },
    {
      title: 'Utilisateurs',
      href: '/admin/user-roles',
      icon: UserCog,
      description: 'Gestion utilisateurs'
    },
    {
      title: 'Gamification',
      href: '/gamification',
      icon: Zap,
      description: 'Achievements et défis'
    },
    {
      title: 'Statistiques d\'usage',
      href: '/app/analytics',
      icon: Database,
      description: 'Analytics d\'utilisation'
    },
    {
      title: 'Conformité RGPD',
      href: '/admin/gdpr',
      icon: Shield,
      description: 'Sécurité et conformité'
    },
    {
      title: 'Monitoring APIs',
      href: '/admin/api-monitoring',
      icon: DollarSign,
      description: 'OpenAI & Hume (coûts)'
    },
    {
      title: 'Paramètres',
      href: '/settings/general',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  const isActivePath = (href: string) => {
    if (href === '/app/rh') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-card dark:bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Administration
        </h2>
        
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
