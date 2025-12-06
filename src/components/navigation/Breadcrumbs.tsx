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
    // Routes B2C
    '/b2c/dashboard': 'Tableau de bord',
    '/b2c/scan': 'Scan Émotions',
    '/b2c/music': 'Musique Thérapeutique',
    '/b2c/coach': 'Coach IA',
    '/b2c/journal': 'Journal',
    '/b2c/vr': 'Réalité Virtuelle',
    '/b2c/preferences': 'Préférences',
    '/b2c/settings': 'Paramètres',
    '/b2c/gamification': 'Gamification',
    '/b2c/social-cocon': 'Cocon Social',
    
    // Fun-First B2C
    '/b2c/bubble-beat': 'Bubble Beat',
    '/b2c/flash-glow': 'Flash Glow',
    '/b2c/boss-level-grit': 'Boss Level Grit',
    '/b2c/mood-mixer': 'Mood Mixer',
    '/b2c/bounce-back-battle': 'Bounce Back Battle',
    '/b2c/breathwork': 'Respiration',
    '/b2c/instant-glow': 'Instant Glow',
    '/b2c/vr-galactique': 'VR Galactique',
    '/b2c/screen-silk-break': 'Screen Silk Break',
    '/b2c/story-synth-lab': 'Story Synth Lab',
    '/b2c/ar-filters': 'Filtres AR',
    '/b2c/ambition-arcade': 'Ambition Arcade',
    '/b2c/weekly-bars': 'Barres Hebdo',
    '/b2c/heatmap-vibes': 'Scores & vibes',
    
    // Paramètres B2C
    '/b2c/profile-settings': 'Profil',
    '/b2c/activity-history': 'Historique',
    '/b2c/notifications': 'Notifications',
    '/b2c/feedback': 'Feedback',
    '/b2c/settings-rgpd': 'RGPD',
    '/b2c/account-delete': 'Suppression Compte',
    '/b2c/export-csv': 'Export CSV',
    '/b2c/privacy-toggles': 'Confidentialité',
    '/b2c/health-check-badge': 'Badge Santé',
    
    // Routes B2B User
    '/b2b/user/dashboard': 'Dashboard RH',
    '/b2b/user/scan': 'Scan Équipe',
    '/b2b/user/music': 'Musique RH',
    '/b2b/user/coach': 'Coach Équipe',
    '/b2b/user/journal': 'Journal RH',
    '/b2b/user/vr': 'VR Entreprise',
    '/b2b/user/preferences': 'Préférences RH',
    '/b2b/user/settings': 'Paramètres RH',
    '/b2b/user/gamification': 'Gamification RH',
    '/b2b/user/social-cocon': 'Cocon Équipe',
    
    // Routes B2B Admin
    '/b2b/admin/dashboard': 'Administration',
    '/b2b/admin/teams': 'Gestion Équipes',
    '/b2b/admin/reports': 'Rapports',
    '/b2b/admin/events': 'Événements',
    '/b2b/admin/optimisation': 'Optimisation',
    '/b2b/admin/settings': 'Paramètres Admin',
    '/b2b/admin/security': 'Sécurité',
    '/b2b/admin/audit': 'Audit',
    '/b2b/admin/accessibility': 'Accessibilité'
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Home breadcrumb basé sur le rôle utilisateur
    if (user?.role === 'b2c') {
      breadcrumbs.push({ label: 'Accueil', path: '/b2c/dashboard', icon: <Home className="h-4 w-4" /> });
    } else if (user?.role === 'b2b_user') {
      breadcrumbs.push({ label: 'RH', path: '/b2b/user/dashboard', icon: <Home className="h-4 w-4" /> });
    } else if (user?.role === 'b2b_admin') {
      breadcrumbs.push({ label: 'Admin', path: '/b2b/admin/dashboard', icon: <Home className="h-4 w-4" /> });
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