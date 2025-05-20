
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyConsentBannerProps {
  onAccept: (selections: {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => void;
  onClose: () => void;
}

const PrivacyConsentBanner: React.FC<PrivacyConsentBannerProps> = ({ onAccept, onClose }) => {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selections, setSelections] = useState({
    essential: true, // Essential is always required
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Simulate a delay before showing the banner
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (key: keyof typeof selections) => {
    if (key === 'essential') return; // Essential cannot be toggled
    setSelections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAccept = () => {
    onAccept(selections);
    setShow(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    onAccept(allAccepted);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:bottom-8 md:right-8 md:max-w-lg"
        >
          <div className="bg-card border shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Vos choix de confidentialité</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fermer</span>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Nous utilisons des cookies et des technologies similaires pour personnaliser votre expérience et comprendre comment vous interagissez avec notre plateforme.
              </p>
              
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="essential" className="font-medium">Essentiels</Label>
                        <p className="text-xs text-muted-foreground">
                          Toujours actifs. Nécessaires au fonctionnement du site.
                        </p>
                      </div>
                      <Switch
                        id="essential"
                        checked={selections.essential}
                        disabled
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="functional" className="font-medium">Fonctionnels</Label>
                        <p className="text-xs text-muted-foreground">
                          Améliorent votre expérience utilisateur.
                        </p>
                      </div>
                      <Switch
                        id="functional"
                        checked={selections.functional}
                        onCheckedChange={() => handleToggle('functional')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="analytics" className="font-medium">Analytiques</Label>
                        <p className="text-xs text-muted-foreground">
                          Nous aident à comprendre comment vous utilisez le site.
                        </p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={selections.analytics}
                        onCheckedChange={() => handleToggle('analytics')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing" className="font-medium">Marketing</Label>
                        <p className="text-xs text-muted-foreground">
                          Permettent de vous proposer des contenus personnalisés.
                        </p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={selections.marketing}
                        onCheckedChange={() => handleToggle('marketing')}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setExpanded(!expanded)}
                  className="sm:order-1"
                >
                  {expanded ? "Masquer les options" : "Personnaliser"}
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="sm:order-3"
                  onClick={handleAcceptAll}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Tout accepter
                </Button>
                {expanded && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="sm:order-2"
                    onClick={handleAccept}
                  >
                    Enregistrer mes choix
                  </Button>
                )}
              </div>
            </div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-1 bg-primary origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyConsentBanner;
