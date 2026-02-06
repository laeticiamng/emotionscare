import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const COOKIE_CONSENT_KEY = 'cookie_consent_v1';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

/**
 * Bandeau cookies conforme RGPD
 * - Essentiels : toujours actifs (auth Supabase)
 * - Fonctionnels : préférences utilisateur
 * - Analytics : mesure d'audience (opt-in)
 */
export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    timestamp: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      // Délai pour ne pas bloquer le rendu initial
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: Partial<CookiePreferences>) => {
    const finalPrefs: CookiePreferences = {
      ...preferences,
      ...prefs,
      essential: true, // Toujours actif
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(finalPrefs));
    setPreferences(finalPrefs);
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ functional: true, analytics: true });
  };

  const handleRejectAll = () => {
    savePreferences({ functional: false, analytics: false });
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        >
          <div className="pointer-events-auto p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">
                    Nous respectons votre vie privée
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Nous utilisons des cookies essentiels pour le fonctionnement du site 
                    (authentification Supabase). Vous pouvez accepter ou refuser les cookies 
                    optionnels (fonctionnels et analytics).{' '}
                    <a href="/legal/cookies" className="text-primary hover:underline">
                      En savoir plus
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Paramétrer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                >
                  Refuser
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                >
                  Accepter tout
                </Button>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modal Paramètres */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Paramètres des cookies
            </DialogTitle>
            <DialogDescription>
              Gérez vos préférences de cookies. Les cookies essentiels sont 
              nécessaires au fonctionnement du site.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Essentiels */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Cookies essentiels</Label>
                <p className="text-xs text-muted-foreground">
                  Authentification, sécurité, préférences de session
                </p>
              </div>
              <Switch checked disabled aria-label="Cookies essentiels toujours actifs" />
            </div>

            {/* Fonctionnels */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="functional-cookies" className="font-medium">
                  Cookies fonctionnels
                </Label>
                <p className="text-xs text-muted-foreground">
                  Thème, accessibilité, préférences d'affichage
                </p>
              </div>
              <Switch
                id="functional-cookies"
                checked={preferences.functional}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, functional: checked }))
                }
              />
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analytics-cookies" className="font-medium">
                  Cookies analytics
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mesure d'audience anonymisée (Matomo)
                </p>
              </div>
              <Switch
                id="analytics-cookies"
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, analytics: checked }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleRejectAll}>
              Tout refuser
            </Button>
            <Button onClick={handleSaveSettings}>
              Enregistrer mes choix
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner;
