
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Brain, 
  FileText, 
  Scan, 
  Music, 
  MessageCircle, 
  Glasses, 
  Settings,
  Users,
  BarChart3,
  Calendar,
  Sparkles,
  Shield,
  Heart,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  roles: ('b2c' | 'b2b_user' | 'b2b_admin')[];
  category: 'core' | 'tools' | 'admin' | 'social';
}

const navigationItems: NavItem[] = [
  // Core pages - accessible to all
  {
    href: '/scan',
    label: 'Scan Émotionnel',
    icon: Scan,
    description: 'Analysez votre état émotionnel instantanément',
    badge: 'IA',
    roles: ['b2c', 'b2b_user', 'b2b_admin'],
    category: 'core'
  },
  {
    href: '/journal',
    label: 'Journal Personnel',
    icon: FileText,
    description: 'Votre espace de réflexion quotidien',
    roles: ['b2c', 'b2b_user', 'b2b_admin'],
    category: 'core'
  },
  {
    href: '/coach',
    label: 'Coach IA',
    icon: Brain,
    description: 'Accompagnement personnalisé par IA',
    badge: 'Premium',
    roles: ['b2c', 'b2b_user', 'b2b_admin'],
    category: 'core'
  },
  
  // Tools - accessible to all users
  {
    href: '/music',
    label: 'Musicothérapie',
    icon: Music,
    description: 'Sons et musiques thérapeutiques',
    roles: ['b2c', 'b2b_user', 'b2b_admin'],
    category: 'tools'
  },
  {
    href: '/vr',
    label: 'Réalité Virtuelle',
    icon: Glasses,
    description: 'Immersion relaxante et méditative',
    badge: 'VR',
    roles: ['b2c', 'b2b_user', 'b2b_admin'],
    category: 'tools'
  },
  {
    href: '/gamification',
    label: 'Défis & Récompenses',
    icon: Target,
    description: 'Progressez en vous amusant',
    roles: ['b2c', 'b2b_user', 'b2b_admin'],
    category: 'tools'
  },
  
  // Social features
  {
    href: '/social-cocon',
    label: 'Cocon Social',
    icon: Heart,
    description: 'Communauté bienveillante',
    roles: ['b2c', 'b2b_user', 'b2b_admin'],
    category: 'social'
  },
  
  // Admin-only features
  {
    href: '/teams',
    label: 'Gestion d\'Équipes',
    icon: Users,
    description: 'Gérez vos collaborateurs',
    roles: ['b2b_admin'],
    category: 'admin'
  },
  {
    href: '/reports',
    label: 'Rapports Analytics',
    icon: BarChart3,
    description: 'Analyses et métriques détaillées',
    roles: ['b2b_admin'],
    category: 'admin'
  },
  {
    href: '/events',
    label: 'Événements RH',
    icon: Calendar,
    description: 'Planification et suivi des événements',
    roles: ['b2b_admin'],
    category: 'admin'
  },
  {
    href: '/optimisation',
    label: 'Optimisation',
    icon: Sparkles,
    description: 'Outils d\'optimisation avancés',
    roles: ['b2b_admin'],
    category: 'admin'
  },
  
  // Settings - accessible to all
  {
    href: '/settings',
    label: 'Paramètres',
    icon: Settings,
    description: 'Configuration personnelle',
    roles: ['b2c', 'b2b_user', 'b2b_admin'],
    category: 'core'
  }
];

interface AdaptiveNavigationProps {
  variant?: 'sidebar' | 'grid' | 'list';
  showCategories?: boolean;
  onItemClick?: () => void;
}

const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({
  variant = 'list',
  showCategories = true,
  onItemClick
}) => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const location = useLocation();
  
  const userRole = user?.role || userMode || 'b2c';
  
  // Filter items based on user role
  const accessibleItems = navigationItems.filter(item => 
    item.roles.includes(userRole as any)
  );
  
  // Group by category if needed
  const categorizedItems = showCategories ? 
    accessibleItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, NavItem[]>) : 
    { all: accessibleItems };
  
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'core': return 'Fonctionnalités Principales';
      case 'tools': return 'Outils Thérapeutiques';
      case 'admin': return 'Administration';
      case 'social': return 'Social & Communauté';
      default: return '';
    }
  };
  
  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.href;
    const IconComponent = item.icon;
    
    if (variant === 'sidebar') {
      return (
        <Link
          key={item.href}
          to={item.href}
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
            isActive 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <IconComponent className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1 font-medium">{item.label}</span>
          {item.badge && (
            <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      );
    }
    
    if (variant === 'grid') {
      return (
        <Link key={item.href} to={item.href} onClick={onItemClick}>
          <Card className={cn(
            "transition-all duration-200 hover:shadow-md group cursor-pointer",
            isActive && "ring-2 ring-primary bg-primary/5"
          )}>
            <CardContent className="p-4 text-center">
              <div className={cn(
                "w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted group-hover:bg-primary group-hover:text-primary-foreground"
              )}>
                <IconComponent className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1 flex items-center justify-center gap-2">
                {item.label}
                {item.badge && (
                  <Badge variant="outline" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </h3>
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
            </CardContent>
          </Card>
        </Link>
      );
    }
    
    // List variant (default)
    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={onItemClick}
        className={cn(
          "flex items-center gap-4 p-4 rounded-lg transition-all duration-200 group",
          isActive 
            ? "bg-primary/10 border-primary/20 border" 
            : "hover:bg-muted border border-transparent"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted group-hover:bg-primary group-hover:text-primary-foreground"
        )}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{item.label}</h3>
            {item.badge && (
              <Badge variant="outline" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>
      </Link>
    );
  };
  
  return (
    <div className="space-y-6">
      {Object.entries(categorizedItems).map(([category, items]) => (
        <div key={category}>
          {showCategories && category !== 'all' && (
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
              {getCategoryTitle(category)}
            </h2>
          )}
          <div className={cn(
            variant === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-1"
          )}>
            {items.map(renderNavItem)}
          </div>
        </div>
      ))}
      
      {/* Role indicator */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>
            Mode: {userRole === 'b2c' ? 'Particulier' : 
                   userRole === 'b2b_user' ? 'Collaborateur' : 
                   'Administrateur RH'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveNavigation;
