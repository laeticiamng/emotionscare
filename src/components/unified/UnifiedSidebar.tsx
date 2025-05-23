
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, BarChart2, Heart, FileText, Music, Headphones, 
  Video, Settings, Users, Building2, LogOut, User,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UnifiedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  isOpen,
  onToggle
}) => {
  const location = useLocation();
  const { userMode } = useUserMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const normalizedUserMode = normalizeUserMode(userMode);
  
  const generalNavItems = [
    { label: 'Accueil', icon: Home, href: '/' },
    { label: 'Tableau de bord', icon: BarChart2, href: getDashboardPath(normalizedUserMode) },
    { label: 'Scan émotionnel', icon: Heart, href: getScanPath(normalizedUserMode) },
  ];
  
  // Navigation items spécifiques au mode utilisateur
  const modeSpecificNavItems = getNavItemsByMode(normalizedUserMode);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };
  
  // Déterminer si un lien est actif
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };
  
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r pt-16 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex justify-between items-center p-4 md:hidden">
          <h2 className="font-semibold text-lg">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="h-full py-2 px-3">
          <div className="space-y-6">
            {/* Section Navigation générale */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">
                Navigation
              </h3>
              <nav className="space-y-1">
                {generalNavItems.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.href}
                    className={cn(
                      "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Section Mode spécifique */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">
                {normalizedUserMode === 'b2c'
                  ? 'Espace personnel'
                  : normalizedUserMode === 'b2b_user'
                  ? 'Espace collaborateur'
                  : 'Administration'}
              </h3>
              <nav className="space-y-1">
                {modeSpecificNavItems.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.href}
                    className={cn(
                      "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Section Paramètres */}
            <div className="pt-4">
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">
                Paramètres
              </h3>
              <nav className="space-y-1">
                <Link 
                  to="/profile" 
                  className={cn(
                    "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                    isActive('/profile')
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <User className="h-4 w-4 mr-3" />
                  Profil
                </Link>
                <Link 
                  to="/settings" 
                  className={cn(
                    "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                    isActive('/settings')
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Paramètres
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center py-2 px-3 text-sm rounded-md text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Déconnexion
                </button>
              </nav>
            </div>
          </div>
        </ScrollArea>
      </aside>
      
      {/* Overlay pour fermer la sidebar sur mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 z-20 bg-black/50"
          onClick={onToggle}
        />
      )}
    </>
  );
};

// Fonction pour obtenir le chemin du tableau de bord en fonction du mode utilisateur
function getDashboardPath(userMode: string): string {
  switch (userMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/dashboard';
  }
}

// Fonction pour obtenir le chemin du scan en fonction du mode utilisateur
function getScanPath(userMode: string): string {
  switch (userMode) {
    case 'b2c':
      return '/b2c/scan';
    case 'b2b_user':
      return '/b2b/user/scan';
    case 'b2b_admin':
      return '/b2b/admin/scan';
    default:
      return '/scan';
  }
}

// Fonction pour obtenir les éléments de navigation spécifiques au mode utilisateur
function getNavItemsByMode(userMode: string): Array<{ label: string; icon: any; href: string }> {
  switch (userMode) {
    case 'b2c':
      return [
        { label: 'Journal', icon: FileText, href: '/journal' },
        { label: 'Musique', icon: Music, href: '/music' },
        { label: 'Audio', icon: Headphones, href: '/audio' },
        { label: 'Vidéo', icon: Video, href: '/video' }
      ];
    case 'b2b_user':
      return [
        { label: 'Mon équipe', icon: Users, href: '/b2b/user/team' },
        { label: 'Sessions', icon: Calendar, href: '/b2b/user/sessions' },
        { label: 'Journal', icon: FileText, href: '/journal' },
        { label: 'Ressources', icon: Book, href: '/b2b/user/resources' }
      ];
    case 'b2b_admin':
      return [
        { label: 'Utilisateurs', icon: Users, href: '/b2b/admin/users' },
        { label: 'Organisation', icon: Building2, href: '/b2b/admin/organization' },
        { label: 'Analytique', icon: BarChart2, href: '/b2b/admin/analytics' },
        { label: 'Sessions', icon: Calendar, href: '/b2b/admin/sessions' }
      ];
    default:
      return [];
  }
}

// Adding missing imports
import { useNavigate } from 'react-router-dom';
import { Calendar, Book } from 'lucide-react';

export default UnifiedSidebar;
