// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Mic, 
  Heart, 
  Monitor, 
  Settings,
  AlertCircle 
} from 'lucide-react';
import { usePrivacyStore } from '@/store/privacy.store';

interface PrivacyFallbackProps {
  type: 'cam' | 'mic' | 'hr' | 'xr';
  children?: React.ReactNode;
  fallbackContent?: React.ReactNode;
  showSettings?: boolean;
}

/**
 * Composant de fallback privacy avec badges clairs
 * Critères: NoCam/NoMic/SimHR/XR→2D, annonces SR
 */
const PrivacyFallback: React.FC<PrivacyFallbackProps> = ({
  type,
  children,
  fallbackContent,
  showSettings = true
}) => {
  const { prefs, setPref } = usePrivacyStore();
  const isEnabled = prefs[type];

  const getFallbackInfo = () => {
    switch (type) {
      case 'cam':
        return {
          icon: Camera,
          label: 'Caméra désactivée',
          badge: 'NoCam',
          description: 'La caméra est désactivée dans vos préférences de confidentialité.',
          fallback: 'Mode upload d\'image disponible'
        };
      case 'mic':
        return {
          icon: Mic,
          label: 'Microphone désactivé',
          badge: 'NoMic',
          description: 'Le microphone est désactivé dans vos préférences de confidentialité.',
          fallback: 'Mode saisie texte disponible'
        };
      case 'hr':
        return {
          icon: Heart,
          label: 'Capteur cardiaque désactivé',
          badge: 'Simulation',
          description: 'Le monitoring cardiaque est désactivé dans vos préférences.',
          fallback: 'Mode simulation disponible avec données réalistes'
        };
      case 'xr':
        return {
          icon: Monitor,
          label: 'VR/XR désactivé',
          badge: '2D',
          description: 'L\'expérience immersive est désactivée ou indisponible.',
          fallback: 'Version 2D disponible avec toutes les fonctionnalités'
        };
    }
  };

  const fallbackInfo = getFallbackInfo();
  const Icon = fallbackInfo.icon;

  const handleEnableFeature = async () => {
    const success = await setPref(type, true);
    if (success) {
      // Annonce pour les lecteurs d'écran
      const message = `${fallbackInfo.label.replace('désactivé', 'activé')}`;
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = message;
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  };

  // Si activé, afficher le contenu normal
  if (isEnabled) {
    return <>{children}</>;
  }

  // Sinon, afficher le fallback
  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Icon className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
          <Badge variant="secondary" className="font-mono">
            {fallbackInfo.badge}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{fallbackInfo.label}</h3>
          <p className="text-sm text-muted-foreground">
            {fallbackInfo.description}
          </p>
        </div>

        {fallbackContent ? (
          <div className="py-4">
            {fallbackContent}
          </div>
        ) : (
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>{fallbackInfo.fallback}</span>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleEnableFeature}
              size="sm"
              aria-label={`Activer ${fallbackInfo.label.toLowerCase()}`}
            >
              Activer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/preferences#privacy', '_blank')}
              aria-label="Ouvrir les paramètres de confidentialité"
            >
              <Settings className="w-4 h-4 mr-1" aria-hidden="true" />
              Paramètres
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Hook pour les composants bubble-beat avec simulation HR
 */
export const useHRFallback = () => {
  const { prefs } = usePrivacyStore();
  const hrEnabled = prefs.hr;

  const getSimulatedHR = () => {
    // Simulation réaliste avec variation naturelle
    const baseHR = 72;
    const variation = Math.sin(Date.now() / 10000) * 8;
    return Math.round(baseHR + variation);
  };

  const getHRLabel = (hr: number) => {
    if (hr < 60) return 'calme';
    if (hr < 80) return 'neutre';
    return 'soutenu';
  };

  return {
    hrEnabled,
    getSimulatedHR,
    getHRLabel,
    isSimulation: !hrEnabled
  };
};

export default PrivacyFallback;