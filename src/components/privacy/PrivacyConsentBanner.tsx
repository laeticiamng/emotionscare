
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Settings, X, Eye, Target, BarChart, Cookie } from 'lucide-react';
import { useEthics } from '@/contexts/EthicsContext';

interface ConsentOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
  defaultValue: boolean;
}

const PrivacyConsentBanner: React.FC = () => {
  const { updateConsent } = useEthics();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState<Record<string, boolean>>({});

  const consentOptions: ConsentOption[] = [
    {
      id: 'essential',
      title: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.',
      icon: Shield,
      required: true,
      defaultValue: true
    },
    {
      id: 'functional',
      title: 'Cookies fonctionnels',
      description: 'Améliorent votre expérience en sauvegardant vos préférences.',
      icon: Settings,
      required: false,
      defaultValue: true
    },
    {
      id: 'analytics',
      title: 'Cookies analytiques',
      description: 'Nous aident à comprendre comment vous utilisez notre site.',
      icon: BarChart,
      required: false,
      defaultValue: false
    },
    {
      id: 'marketing',
      title: 'Cookies marketing',
      description: 'Permettent de personnaliser les publicités selon vos intérêts.',
      icon: Target,
      required: false,
      defaultValue: false
    }
  ];

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const hasConsented = localStorage.getItem('privacy-consent');
    if (!hasConsented) {
      setIsVisible(true);
      // Initialiser les consentements avec les valeurs par défaut
      const defaultConsents: Record<string, boolean> = {};
      consentOptions.forEach(option => {
        defaultConsents[option.id] = option.defaultValue;
      });
      setConsents(defaultConsents);
    }
  }, []);

  const handleConsentChange = (optionId: string, value: boolean) => {
    setConsents(prev => ({ ...prev, [optionId]: value }));
  };

  const handleAcceptAll = async () => {
    const allConsents: Record<string, boolean> = {};
    consentOptions.forEach(option => {
      allConsents[option.id] = true;
    });
    
    await saveConsents(allConsents);
  };

  const handleAcceptSelected = async () => {
    await saveConsents(consents);
  };

  const handleRejectAll = async () => {
    const minimalConsents: Record<string, boolean> = {};
    consentOptions.forEach(option => {
      minimalConsents[option.id] = option.required;
    });
    
    await saveConsents(minimalConsents);
  };

  const saveConsents = async (finalConsents: Record<string, boolean>) => {
    // Sauvegarder les consentements
    for (const [consentType, granted] of Object.entries(finalConsents)) {
      await updateConsent(consentType as any, granted);
    }
    
    // Marquer comme traité
    localStorage.setItem('privacy-consent', JSON.stringify({
      consents: finalConsents,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
    
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <Card className="mx-auto max-w-4xl shadow-2xl border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Gestion de la confidentialité</h2>
                  <p className="text-sm text-muted-foreground">
                    Nous respectons votre vie privée et vos droits
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, 
                analyser notre trafic et personnaliser le contenu. Vous pouvez choisir quels cookies accepter.
              </p>

              {/* Options de consentement détaillées */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 border rounded-lg p-4 bg-muted/30"
                  >
                    {consentOptions.map((option, index) => (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between space-x-3"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <option.icon className="h-4 w-4 text-primary" />
                          <div>
                            <Label className="font-medium">{option.title}</Label>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={consents[option.id] || false}
                          onCheckedChange={(checked) => handleConsentChange(option.id, checked)}
                          disabled={option.required}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {showDetails ? 'Masquer' : 'Personnaliser'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAll}
                  >
                    Rejeter tout
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  {showDetails && (
                    <Button
                      onClick={handleAcceptSelected}
                      size="sm"
                    >
                      Accepter la sélection
                    </Button>
                  )}
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="bg-primary"
                  >
                    Tout accepter
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                En utilisant notre site, vous acceptez notre{' '}
                <button className="text-primary hover:underline">
                  politique de confidentialité
                </button>
                {' '}et nos{' '}
                <button className="text-primary hover:underline">
                  conditions d'utilisation
                </button>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivacyConsentBanner;
