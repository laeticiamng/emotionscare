import React from 'react';
import { logger } from '@/lib/logger';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { combineClasses } from '@/utils/mobileOptimizations';

interface BreadcrumbItem {
  label: string;
  path: string;
  current?: boolean;
}

interface BreadcrumbNavProps {
  className?: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ className = '' }) => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    try {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      
      if (pathSegments.length === 0) {
        return [{ label: 'Accueil', path: '/', current: true }];
      }
      
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Accueil', path: '/' }
      ];
      
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        
        const pageNames: Record<string, string> = {
          'scan': 'Scan Émotionnel',
          'music': 'Musicothérapie',
          'journal': 'Journal',
          'coach': 'Coach IA',
          'vr': 'Réalité Virtuelle',
          'preferences': 'Préférences',
          'gamification': 'Gamification',
          'social-cocon': 'Social Cocon',
          'profile': 'Profil',
          'notifications': 'Notifications',
          'support': 'Support',
          'security': 'Sécurité',
          'stats': 'Statistiques',
          'b2c': 'Espace Personnel',
          'b2b-selection': 'Espace Entreprise',
          'boss-level-grit': 'Boss Level Grit',
          'bounce-back-battle': 'Bounce Back Battle',
          'story-synth-lab': 'Story Synth Lab',
          'screen-silk-break': 'Screen Silk Break',
          'flash-glow': 'Flash Glow'
        };
        
        breadcrumbs.push({
          label: pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
          path: currentPath,
          current: index === pathSegments.length - 1
        });
      });
      
      return breadcrumbs;
    } catch (error) {
      logger.error('Error in getBreadcrumbs', error as Error, 'UI');
      return [{ label: 'Accueil', path: '/', current: true }];
    }
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <nav className={combineClasses('flex items-center space-x-2 text-sm text-muted-foreground mb-6', className)}>
      <div className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.path}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {breadcrumb.current ? (
              <span className="font-medium text-foreground">
                {breadcrumb.label}
              </span>
            ) : (
              <Link 
                to={breadcrumb.path}
                className="hover:text-foreground transition-colors flex items-center"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {breadcrumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default BreadcrumbNav;
