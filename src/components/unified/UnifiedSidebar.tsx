
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { cn } from '@/lib/utils';
import { 
  Home, Calendar, Music, Timeline, Globe, Sun, Settings, Book, Map, 
  User, MessageSquare, Headphones, Glasses, HeartHandshake, 
  Activity, Users, HelpCircle, LogIn 
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
  requireAuth?: boolean;
}

const UnifiedSidebar: React.FC<{
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}> = ({ className = '', isMobile = false, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  // Generate nav items based on user role
  useEffect(() => {
    // Items accessibles à tous les utilisateurs, qu'ils soient authentifiés ou non
    const publicItems: NavItem[] = [
      { label: 'Accueil', icon: <Home className="h-5 w-5" />, href: '/' },
      { label: 'Équipe', icon: <Users className="h-5 w-5" />, href: '/team' },
      { label: 'Support', icon: <HelpCircle className="h-5 w-5" />, href: '/support' },
    ];
    
    // Items nécessitant une authentification
    const authItems: NavItem[] = [
      { label: 'Tableau de bord', icon: <Activity className="h-5 w-5" />, href: '/dashboard', requireAuth: true },
      { label: 'Profil', icon: <User className="h-5 w-5" />, href: '/profile', requireAuth: true },
      { label: 'Journal', icon: <Book className="h-5 w-5" />, href: '/journal', requireAuth: true },
      { label: 'Musique', icon: <Music className="h-5 w-5" />, href: '/music', requireAuth: true },
      { label: 'Coach', icon: <MessageSquare className="h-5 w-5" />, href: '/coach', requireAuth: true },
      { label: 'Audio', icon: <Headphones className="h-5 w-5" />, href: '/audio', requireAuth: true },
      { label: 'Réalité Virtuelle', icon: <Glasses className="h-5 w-5" />, href: '/vr', requireAuth: true },
      { label: 'Social Cocoon', icon: <HeartHandshake className="h-5 w-5" />, href: '/social', requireAuth: true },
      { label: 'Sessions', icon: <Calendar className="h-5 w-5" />, href: '/sessions', requireAuth: true },
    ];
    
    // Items spécifiques aux utilisateurs B2B
    const b2bItems: NavItem[] = [
      { label: 'Équipes', icon: <Users className="h-5 w-5" />, href: '/teams', roles: ['b2b_user', 'b2b_admin'], requireAuth: true },
      { label: 'Cartographie', icon: <Map className="h-5 w-5" />, href: '/mapping', roles: ['b2b_admin'], requireAuth: true },
    ];
    
    // Combinaison des items en fonction du statut d'authentification
    let combinedItems = [...publicItems];
    
    if (isAuthenticated) {
      combinedItems = [...combinedItems, ...authItems];
      
      // Ajout des items B2B si l'utilisateur a le mode approprié
      if (userMode && (userMode === 'b2b_user' || userMode === 'b2b_admin')) {
        combinedItems = [
          ...combinedItems,
          ...b2bItems.filter(item => !item.roles || item.roles.includes(userMode))
        ];
      }
    } else {
      // Ajouter un bouton de connexion si l'utilisateur n'est pas authentifié
      combinedItems.push({ 
        label: 'Connexion', 
        icon: <LogIn className="h-5 w-5" />, 
        href: '/login' 
      });
    }
    
    // Ajout des paramètres à la fin
    if (isAuthenticated) {
      combinedItems.push({ 
        label: 'Paramètres', 
        icon: <Settings className="h-5 w-5" />, 
        href: '/settings',
        requireAuth: true
      });
    }
    
    setNavItems(combinedItems);
  }, [userMode, isAuthenticated]);

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "border-r w-64 h-screen flex flex-col bg-background",
        className
      )}
    >
      {isMobile && (
        <div className="h-16 border-b flex items-center px-4 font-bold text-lg">
          EmotionsCare
        </div>
      )}
      
      <ScrollArea className="flex-1 py-6">
        <nav className="px-2 space-y-2">
          {navItems
            .filter(item => !item.requireAuth || isAuthenticated)
            .map((item, index) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 font-normal",
                      isActive ? "bg-secondary" : ""
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </motion.div>
              );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default UnifiedSidebar;
