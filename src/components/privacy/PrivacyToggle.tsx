// @ts-nocheck

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Camera, 
  Mic, 
  Heart, 
  MapPin, 
  Users, 
  Coins,
  HelpCircle,
  Lock
} from 'lucide-react';
import { usePrivacyPrefs } from '@/hooks/usePrivacyPrefs';
import { PrivacyKey } from '@/store/privacy.store';
import { PolicyBadge } from './PolicyBadge';

const PRIVACY_CONFIG = {
  cam: {
    label: 'Caméra',
    icon: Camera,
    description: 'Pour la reconnaissance faciale et les scans émotionnels',
    risks: 'Les images sont traitées localement et jamais stockées sans votre accord explicite.'
  },
  mic: {
    label: 'Microphone', 
    icon: Mic,
    description: 'Pour les exercices vocaux et la commande vocale',
    risks: 'L\'audio est traité en temps réel et non enregistré par défaut.'
  },
  hr: {
    label: 'Fréquence cardiaque',
    icon: Heart,
    description: 'Données de santé via capteurs externes (montres, ceintures)',
    risks: 'Les données de fréquence cardiaque sont utilisées uniquement pour personnaliser les exercices.'
  },
  gps: {
    label: 'Localisation',
    icon: MapPin,
    description: 'Pour contextualiser les exercices selon votre environnement',
    risks: 'Seule la ville est utilisée, jamais l\'adresse précise.'
  },
  social: {
    label: 'Partage social',
    icon: Users,
    description: 'Partager vos progrès avec vos contacts',
    risks: 'Seuls les données que vous choisissez explicitement sont partagées.'
  },
  nft: {
    label: 'Badges NFT',
    icon: Coins,
    description: 'Collecter vos accomplissements sous forme de NFT',
    risks: 'Les NFT sont optionnels et ne contiennent aucune donnée personnelle.'
  }
} as const;

export const PrivacyToggle: React.FC = () => {
  const { prefs, lockedByOrg, loading, error, setPref } = usePrivacyPrefs();
  const [showHelp, setShowHelp] = useState(false);
  const [consentDialog, setConsentDialog] = useState<PrivacyKey | null>(null);

  const handleToggle = async (key: PrivacyKey, value: boolean) => {
    // Show consent dialog for first-time enabling of sensitive capabilities
    if (value && (key === 'cam' || key === 'mic' || key === 'hr')) {
      setConsentDialog(key);
      return;
    }

    await setPref(key, value);
  };

  const handleConsent = async (key: PrivacyKey) => {
    await setPref(key, true);
    setConsentDialog(null);
  };

  return (
    <section 
      aria-label="Confidentialité & capteurs"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Confidentialité & Capteurs</h2>
          <p className="text-sm text-muted-foreground">
            Contrôle l'accès aux capteurs et fonctionnalités
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHelp(true)}
          aria-haspopup="dialog"
          aria-label="Pourquoi ces autorisations ?"
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          Pourquoi ?
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {(Object.keys(PRIVACY_CONFIG) as PrivacyKey[]).map((key) => {
          const config = PRIVACY_CONFIG[key];
          const IconComponent = config.icon;
          const isLocked = !!lockedByOrg[key];
          const isEnabled = prefs[key];
          
          return (
            <div 
              key={key}
              className={`
                flex items-center justify-between p-4 border rounded-lg
                ${isLocked ? 'bg-muted/30' : 'hover:bg-muted/50'}
                transition-colors
              `}
            >
              <div className="flex items-center gap-3 flex-1">
                <IconComponent className="w-5 h-5 text-muted-foreground" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor={`privacy-${key}`}
                      className={`font-medium cursor-pointer ${isLocked ? 'text-muted-foreground' : ''}`}
                    >
                      {config.label}
                    </Label>
                    {isLocked && <PolicyBadge />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {config.description}
                  </p>
                </div>
              </div>

              <Switch
                id={`privacy-${key}`}
                role="switch"
                aria-checked={isEnabled}
                aria-label={`${isEnabled ? 'Désactiver' : 'Activer'} ${config.label}`}
                checked={isEnabled}
                onCheckedChange={(value) => handleToggle(key, value)}
                disabled={isLocked || loading}
              />
            </div>
          );
        })}
      </div>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pourquoi ces autorisations ?</DialogTitle>
            <DialogDescription>
              Ces paramètres te permettent de contrôler précisément quelles données 
              l'application peut utiliser pour personnaliser ton expérience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {(Object.keys(PRIVACY_CONFIG) as PrivacyKey[]).map((key) => {
              const config = PRIVACY_CONFIG[key];
              const IconComponent = config.icon;
              
              return (
                <div key={key} className="flex gap-3">
                  <IconComponent className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{config.risks}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Consent Dialog */}
      <Dialog open={!!consentDialog} onOpenChange={() => setConsentDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autoriser l'accès {consentDialog && PRIVACY_CONFIG[consentDialog].label} ?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3">
                {consentDialog && (
                  <>
                    <p>{PRIVACY_CONFIG[consentDialog].description}</p>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{PRIVACY_CONFIG[consentDialog].risks}</p>
                    </div>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setConsentDialog(null)}
            >
              Annuler
            </Button>
            <Button 
              onClick={() => consentDialog && handleConsent(consentDialog)}
            >
              Autoriser
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};