/**
 * EnrichedHeroSection - Section héro interventionnelle OPTIMISÉE
 * Vision: EmotionsCare n'est pas une plateforme, c'est un réflexe émotionnel
 * Performance: CSS animations au lieu de framer-motion pour FCP/LCP
 */

import React, { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { StopCircle, Clock, Heart, Shield, Brain, GraduationCap, Stethoscope, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { EmergencyAccessModal } from './EmergencyAccessModal';

const EnrichedHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState<'stop' | 'night' | 'reset'>('stop');

  // Action immédiate - lancer une session
  const handleImmediateAction = () => {
    navigate('/app/scan');
  };

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center py-12 lg:py-20 bg-background">
      <div className="container relative z-10">
        <div className="text-center space-y-10 max-w-5xl mx-auto animate-in fade-in duration-500">
          {/* Badge contextuel - pas de jargon tech */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Badge
              variant="secondary"
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 backdrop-blur-sm"
            >
              <Heart className="h-3.5 w-3.5 mr-2 text-primary" />
              Si tu es ici, ce n'est probablement pas par curiosité.
            </Badge>
          </div>

          {/* Headline interventionnelle - positionnement santé */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight px-2 sm:px-0">
              <span className="text-foreground">
                Prendre soin de celles et ceux
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/90 to-blue-500 bg-clip-text text-transparent">
                qui prennent soin.
              </span>
            </h1>
          </div>

          {/* Sous-titre - urgence avant explication */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            Une plateforme de régulation émotionnelle dédiée{' '}
            <strong className="text-foreground font-medium">aux étudiants en santé et aux soignants.</strong>
          </p>

          {/* CTAs émotionnels - action avant compréhension */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            {/* CTA Principal - Essai gratuit vers /b2c */}
            <div
              className={cn(
                "transition-transform duration-300",
                isHovered ? "scale-105" : "animate-pulse-slow"
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link to="/b2c">
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-500 px-10 py-7 text-lg font-semibold group"
                >
                  <Heart className="h-5 w-5 mr-3" aria-hidden="true" />
                  <span>Essai gratuit 30 jours</span>
                  
                  {/* Effet de brillance au hover - CSS only */}
                  <span 
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
                      "transition-transform duration-600",
                      isHovered ? "translate-x-full" : "-translate-x-full"
                    )}
                  />
                </Button>
              </Link>
            </div>

            {/* CTA secondaire - action immédiate */}
            <Button
              size="lg"
              variant="ghost"
              onClick={handleImmediateAction}
              className="text-muted-foreground hover:text-foreground px-8 py-7 text-lg group"
            >
              <Clock className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" aria-hidden="true" />
              <span>Commencer maintenant</span>
            </Button>
          </div>

          {/* Indicateurs de confiance - réassurance santé */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center text-sm text-muted-foreground pt-8 sm:pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-primary/15 rounded-full flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <span>Étudiants en santé</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-emerald-500/15 rounded-full flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              </div>
              <span>Soignants & internes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-green-500/15 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-500" aria-hidden="true" />
              </div>
              <span>100% confidentiel</span>
            </div>
          </div>

          {/* Cartes de sessions - protocoles, pas playlists */}
          <div className="pt-8 sm:pt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 max-w-4xl mx-auto px-2 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-600">
            {/* Session STOP */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/app/scan?mode=stop');
                } else {
                  setEmergencyMode('stop');
                  setShowEmergencyModal(true);
                  toast.info('Accès rapide au protocole d\'urgence');
                }
              }}
              className="text-left bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <StopCircle className="h-5 w-5 text-red-500" />
                </div>
                <Badge variant="outline" className="text-xs border-red-500/30 text-red-500">
                  Urgence
                </Badge>
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Stop</p>
              <p className="text-sm text-muted-foreground">
                Interrompre une montée anxieuse en cours
              </p>
            </button>

            {/* Session Arrêt mental */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/app/scan?mode=mental-stop');
                } else {
                  setEmergencyMode('night');
                  setShowEmergencyModal(true);
                  toast.info('Accès rapide au protocole nuit');
                }
              }}
              className="text-left bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-indigo-500" />
                </div>
                <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-500">
                  Nuit
                </Badge>
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Arrêt mental</p>
              <p className="text-sm text-muted-foreground">
                Quand le corps est épuisé mais que le cerveau refuse
              </p>
            </button>

            {/* Session Reset */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/app/scan?mode=reset');
                } else {
                  setEmergencyMode('reset');
                  setShowEmergencyModal(true);
                  toast.info('Accès rapide au protocole reset');
                }
              }}
              className="text-left bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-500">
                  Journée
                </Badge>
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Reset</p>
              <p className="text-sm text-muted-foreground">
                Quand tu dois continuer sans t'effondrer
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'urgence pour utilisateurs non connectés */}
      <EmergencyAccessModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        defaultMode={emergencyMode}
      />
    </section>
  );
};

export default memo(EnrichedHeroSection);
