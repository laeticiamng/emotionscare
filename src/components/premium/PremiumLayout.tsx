import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import PremiumBackground from './PremiumBackground';
import RealTimeNotifications from './RealTimeNotifications';
import ImmersiveExperience from './ImmersiveExperience';
import FloatingActionMenu from '../layout/FloatingActionMenu';
import EnhancedHeader from '../layout/EnhancedHeader';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface PremiumLayoutProps {
  children?: React.ReactNode;
  variant?: 'default' | 'premium' | 'immersive';
  showNotifications?: boolean;
  showFloatingMenu?: boolean;
  className?: string;
}

const PremiumLayout: React.FC<PremiumLayoutProps> = ({
  children,
  variant = 'premium',
  showNotifications = true,
  showFloatingMenu = true,
  className
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [pageTransition, setPageTransition] = useState('');

  // Détecter la première visite pour l'expérience d'onboarding
  useEffect(() => {
    const hasVisited = localStorage.getItem('emotionscare_visited');
    if (!hasVisited && user) {
      setIsFirstVisit(true);
      localStorage.setItem('emotionscare_visited', 'true');
    }
  }, [user]);

  // Animation de transition entre pages
  useEffect(() => {
    setPageTransition(location.pathname);
  }, [location]);

  const getBackgroundVariant = () => {
    switch (variant) {
      case 'immersive':
        return 'neural';
      case 'premium':
        return 'particles';
      default:
        return 'gradient';
    }
  };

  const getBackgroundIntensity = () => {
    switch (variant) {
      case 'immersive':
        return 'high';
      case 'premium':
        return 'medium';
      default:
        return 'subtle';
    }
  };

  return (
    <div className={cn("min-h-screen relative", className)}>
      {/* Arrière-plan premium */}
      <PremiumBackground 
        variant={getBackgroundVariant()} 
        intensity={getBackgroundIntensity()}
      />

      {/* Header amélioré */}
      <EnhancedHeader />

      {/* Contenu principal avec transitions */}
      <motion.main
        key={pageTransition}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
        className="relative z-10 pt-16"
      >
        <AnimatePresence mode="wait">
          {children || <Outlet />}
        </AnimatePresence>
      </motion.main>

      {/* Notifications en temps réel */}
      {showNotifications && (
        <RealTimeNotifications
          position="top-right"
          maxVisible={3}
          userId={user?.id}
        />
      )}

      {/* Menu d'actions flottant */}
      {showFloatingMenu && (
        <FloatingActionMenu />
      )}

      {/* Expérience d'onboarding pour nouveaux utilisateurs */}
      {isFirstVisit && (
        <ImmersiveExperience
          variant="welcome"
          title="Bienvenue dans EmotionsCare Premium"
          subtitle="Votre nouvelle plateforme de bien-être émotionnel"
          onComplete={() => setIsFirstVisit(false)}
        >
          <div className="text-center space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  🧠
                </div>
                <p className="text-xs text-muted-foreground">IA Personnalisée</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  🎵
                </div>
                <p className="text-xs text-muted-foreground">Musicothérapie</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  🏆
                </div>
                <p className="text-xs text-muted-foreground">Gamification</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto">
                  👥
                </div>
                <p className="text-xs text-muted-foreground">Communauté</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Découvrez une expérience unique avec des recommandations personnalisées, 
              un système de récompenses et une communauté bienveillante.
            </p>
          </div>
        </ImmersiveExperience>
      )}

      {/* Overlay de chargement global */}
      <AnimatePresence>
        {/* Ici on pourrait ajouter un loader global si nécessaire */}
      </AnimatePresence>
    </div>
  );
};

export default PremiumLayout;