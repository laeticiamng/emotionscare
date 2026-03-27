// @ts-nocheck
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const pathToLabel = {
    // Routes canoniques App
    '/app/consumer/home': 'Tableau de bord',
    '/app/scan': 'Scan Émotions',
    '/app/music': 'Musique Thérapeutique',
    '/app/coach': 'Coach IA',
    '/app/journal': 'Journal',
    '/app/vr': 'Réalité Virtuelle',
    '/settings/general': 'Paramètres',
    '/gamification': 'Gamification',
    '/app/social-cocon': 'Cocon Social',
    
    // Fun-First modules
    '/app/bubble-beat': 'Bubble Beat',
    '/app/flash-glow': 'Flash Glow',
    '/app/boss-grit': 'Boss Level Grit',
    '/app/mood-mixer': 'Mood Mixer',
    '/app/bounce-back': 'Bounce Back Battle',
    '/app/breath': 'Respiration',
    '/app/vr-galaxy': 'VR Galactique',
    '/app/screen-silk': 'Screen Silk Break',
    '/app/story-synth': 'Story Synth Lab',
    '/app/face-ar': 'Filtres AR',
    '/app/ambition-arcade': 'Ambition Arcade',
    '/app/activity': 'Activité',
    '/app/scores': 'Scores & vibes',
    
    // Paramètres
    '/settings/profile': 'Profil',
    '/settings/notifications': 'Notifications',
    '/settings/privacy': 'RGPD',
    
    // Routes B2B
    '/app/collab': 'Dashboard Collaborateur',
    '/app/rh': 'Dashboard RH',
    '/app/teams': 'Gestion Équipes',
    '/app/reports': 'Rapports',
    '/app/events': 'Événements',
    '/app/optimization': 'Optimisation',
    '/app/security': 'Sécurité',
    '/app/audit': 'Audit',
    '/app/accessibility': 'Accessibilité'
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Home breadcrumb basé sur le rôle utilisateur
    if (user?.role === 'b2c' || user?.role === 'consumer') {
      breadcrumbs.push({ label: 'Accueil', path: '/app/consumer/home', icon: <Home className="h-4 w-4" /> });
    } else if (user?.role === 'b2b_user' || user?.role === 'employee') {
      breadcrumbs.push({ label: 'Espace Collab', path: '/app/collab', icon: <Home className="h-4 w-4" /> });
    } else if (user?.role === 'b2b_admin' || user?.role === 'manager') {
      breadcrumbs.push({ label: 'Admin RH', path: '/app/rh', icon: <Home className="h-4 w-4" /> });
    }
    
    // Construction des breadcrumbs pour le chemin actuel
    let currentPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      
      const label = pathToLabel[currentPath as keyof typeof pathToLabel];
      if (label && currentPath !== breadcrumbs[0]?.path) {
        breadcrumbs.push({ label, path: currentPath });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-4" 
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index === breadcrumbs.length - 1 ? (
            <span className="flex items-center gap-1 text-foreground font-medium">
              {breadcrumb.icon}
              {breadcrumb.label}
            </span>
          ) : (
            <>
              <Link 
                to={breadcrumb.path}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {breadcrumb.icon}
                {breadcrumb.label}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;