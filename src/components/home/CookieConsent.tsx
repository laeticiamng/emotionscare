/**
 * CookieConsent - Bannière de consentement aux cookies RGPD
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Shield, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieConsentProps {
  className?: string;
  onAccept?: (preferences: CookiePreferences) => void;
  onDecline?: () => void;
}

const COOKIE_CONSENT_KEY = 'emotionscare_cookie_consent';

const CookieConsent: React.FC<CookieConsentProps> = ({
  className,
  onAccept,
  onDecline,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
    personalization: true,
  });

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Afficher après un délai
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allAccepted));
    setIsVisible(false);
    onAccept?.(allAccepted);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    setIsVisible(false);
    onAccept?.(preferences);
  };

  const handleDecline = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(onlyNecessary));
    setIsVisible(false);
    onDecline?.();
  };

  const cookieTypes = [
    {
      id: 'necessary',
      label: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site',
      disabled: true,
    },
    {
      id: 'analytics',
      label: 'Cookies analytiques',
      description: 'Nous aident à améliorer votre expérience',
      disabled: false,
    },
    {
      id: 'marketing',
      label: 'Cookies marketing',
      description: 'Utilisés pour des publicités pertinentes',
      disabled: false,
    },
    {
      id: 'personalization',
      label: 'Cookies de personnalisation',
      description: 'Adaptent le contenu à vos préférences',
      disabled: false,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6',
            className
          )}
        >
          <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-primary/20">
            <CardContent className="p-4 md:p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Nous respectons votre vie privée</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Conforme RGPD
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDecline}
                  className="flex-shrink-0"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground mb-4">
                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
                Vous pouvez choisir d'accepter tous les cookies ou de personnaliser vos préférences.
              </p>

              {/* Detailed Settings */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 mb-4 overflow-hidden"
                  >
                    {cookieTypes.map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={type.id}
                            className={cn(
                              'text-sm font-medium',
                              type.disabled && 'text-muted-foreground'
                            )}
                          >
                            {type.label}
                            {type.disabled && (
                              <span className="ml-2 text-xs text-primary">(requis)</span>
                            )}
                          </Label>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                        <Switch
                          id={type.id}
                          checked={preferences[type.id as keyof CookiePreferences]}
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({ ...prev, [type.id]: checked }))
                          }
                          disabled={type.disabled}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex-1 sm:flex-none"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {showDetails ? 'Masquer les options' : 'Personnaliser'}
                </Button>
                
                <div className="flex gap-3 flex-1 sm:flex-none sm:ml-auto">
                  <Button
                    variant="ghost"
                    onClick={handleDecline}
                    className="flex-1 sm:flex-none"
                  >
                    Refuser
                  </Button>
                  
                  {showDetails ? (
                    <Button
                      onClick={handleAcceptSelected}
                      className="flex-1 sm:flex-none"
                    >
                      Sauvegarder mes choix
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none"
                    >
                      Tout accepter
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
