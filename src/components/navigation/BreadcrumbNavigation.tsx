import React from 'react';
import { LucideIconType } from '@/types/common';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight, Home } from 'lucide-react';

interface RouteInfo {
  path: string;
  label: string;
  icon?: LucideIconType;
}

const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  
  const routeLabels: Record<string, string> = {
    '/': 'Accueil',
    '/choose-mode': 'Choisir Mode',
    '/onboarding': 'Intégration',
    '/b2c': 'Particulier',
    '/b2c/login': 'Connexion',
    '/b2c/register': 'Inscription',
    '/b2c/dashboard': 'Tableau de bord',
    '/b2b': 'Entreprise',
    '/b2b/selection': 'Sélection',
    '/b2b/user': 'Collaborateur',
    '/b2b/user/login': 'Connexion',
    '/b2b/user/register': 'Inscription',
    '/b2b/user/dashboard': 'Dashboard',
    '/b2b/admin': 'Administration',
    '/b2b/admin/login': 'Connexion Admin',
    '/b2b/admin/dashboard': 'Dashboard Admin',
    '/scan': 'Scanner Émotionnel',
    '/music': 'Musicothérapie',
    '/flash-glow': 'Flash Glow',
    '/boss-level-grit': 'Boss Level Grit',
    '/mood-mixer': 'Mood Mixer',
    '/bounce-back-battle': 'Bounce Back Battle',
    '/breathwork': 'Respiration',
    '/instant-glow': 'Instant Glow',
    '/vr': 'Réalité Virtuelle',
    '/vr-galactique': 'VR Galactique',
    '/screen-silk-break': 'Screen Silk Break',
    '/story-synth-lab': 'Story Synth Lab',
    '/ar-filters': 'Filtres AR',
    '/bubble-beat': 'Bubble Beat',
    '/ambition-arcade': 'Ambition Arcade',
    '/gamification': 'Gamification',
    '/weekly-bars': 'Barres Hebdo',
    '/heatmap-vibes': 'Scores & vibes',
    '/preferences': 'Préférences',
    '/social-cocon': 'Cocon Social',
    '/profile-settings': 'Profil',
    '/activity-history': 'Historique',
    '/notifications': 'Notifications',
    '/feedback': 'Feedback',
    '/teams': 'Équipes',
    '/reports': 'Rapports',
    '/events': 'Événements',
    '/optimisation': 'Optimisation',
    '/settings': 'Paramètres',
    '/security': 'Sécurité',
    '/audit': 'Audit',
    '/accessibility': 'Accessibilité',
    '/innovation': 'Innovation',
    '/help-center': 'Centre d\'Aide',
  };

  const generateBreadcrumbs = (): RouteInfo[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: RouteInfo[] = [
      { path: '/', label: 'Accueil', icon: Home }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        path: currentPath,
        label
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (location.pathname === '/') {
    return null; // Ne pas afficher de breadcrumb sur la page d'accueil
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {crumb.icon && <crumb.icon className="h-4 w-4" />}
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={crumb.path}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {crumb.icon && <crumb.icon className="h-4 w-4" />}
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNavigation;