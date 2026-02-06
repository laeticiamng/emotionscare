import React, { useEffect, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  getConsentPreferences,
  hasStoredConsentPreferences,
  setConsentPreferences,
} from '@/lib/consent';
import { cn } from '@/lib/utils';

const ConsentBanner: React.FC = () => {
  const titleId = useId();
  const descriptionId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Vérifier UNE SEULE FOIS au montage si les préférences existent
    const hasStored = hasStoredConsentPreferences();
    const preferences = getConsentPreferences();
    setAnalyticsEnabled(preferences.categories.analytics);

    if (!hasStored) {
      setIsVisible(true);
      
      // ✅ OPT-IN STRICT CNIL: Bloquer TOUS les trackers AVANT choix
      // Conformité Délibération CNIL 2020-091
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-analytics-consent', 'denied');
      }
      
      // Bloquer Google Analytics si présent
      if (typeof window !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID) {
        (window as any)[`ga-disable-${import.meta.env.VITE_GA_MEASUREMENT_ID}`] = true;
      }
    } else {
      // Préférences déjà enregistrées - ne jamais réafficher
      setIsVisible(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistChoice = (analytics: boolean) => {
    setIsSaving(true);
    try {
      setConsentPreferences({ analytics });
      setAnalyticsEnabled(analytics);
      setIsVisible(false);
      setShowPreferences(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcceptAll = () => {
    persistChoice(true);
  };

  const handleRejectAll = () => {
    persistChoice(false);
  };

  const handleSavePreferences = () => {
    persistChoice(analyticsEnabled);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="fixed inset-x-0 bottom-0 z-50 pointer-events-none"
    >
      <div className="pointer-events-auto border-t border-border bg-background/95 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-3 text-sm">
          <div className="space-y-2 text-left">
            <h2 id={titleId} className="text-base font-semibold text-foreground">
              Votre confidentialité compte
            </h2>
            <p id={descriptionId} className="text-muted-foreground">
              Nous utilisons des cookies pour assurer le bon fonctionnement du site et mesurer son audience.
              Vous pouvez choisir d&apos;activer les cookies d&apos;analyse ou continuer sans les accepter.
            </p>
          </div>
          <div
            className={cn('space-y-3 rounded-md border border-border/60 bg-muted/30 p-4', {
              hidden: !showPreferences,
            })}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="consent-functional" className="text-sm font-medium text-foreground">
                  Cookies fonctionnels
                </Label>
                <p className="text-xs text-muted-foreground">
                  Indispensables pour fournir les fonctionnalités essentielles et sécuriser votre session.
                </p>
              </div>
              <Switch id="consent-functional" checked disabled aria-hidden="true" className="shrink-0" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="consent-analytics" className="text-sm font-medium text-foreground">
                  Mesure d&apos;audience (optionnel)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Autorise les statistiques anonymisées pour améliorer nos services. Aucune donnée ne sera envoyée sans votre
                  accord.
                </p>
              </div>
              <Switch
                id="consent-analytics"
                checked={analyticsEnabled}
                disabled={isSaving}
                onCheckedChange={checked => setAnalyticsEnabled(Boolean(checked))}
                aria-label="Activer les cookies de mesure d'audience"
                className="shrink-0"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button size="sm" onClick={handleSavePreferences} disabled={isSaving}>
                Enregistrer mes choix
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreferences(false)}
                disabled={isSaving}
              >
                Fermer les préférences
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:min-w-[220px]">
          <Button type="button" onClick={handleAcceptAll} disabled={isSaving}>
            Tout accepter
          </Button>
          <Button type="button" variant="outline" onClick={handleRejectAll} disabled={isSaving}>
            Continuer sans accepter
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPreferences(value => !value)}
            disabled={isSaving}
            aria-expanded={showPreferences}
          >
            {showPreferences ? 'Masquer les préférences' : 'Personnaliser'}
          </Button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default ConsentBanner;
