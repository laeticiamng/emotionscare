
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, X, Settings, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PrivacyConsentBannerProps {
  onAccept?: () => void;
  onCustomize?: (preferences: Record<string, boolean>) => void;
  onDecline?: () => void;
}

const PrivacyConsentBanner: React.FC<PrivacyConsentBannerProps> = ({
  onAccept,
  onCustomize,
  onDecline
}) => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be toggled
    functional: true,
    analytics: true,
    marketing: false,
    thirdParty: false
  });

  useEffect(() => {
    // Check if consent was already given
    const hasConsent = localStorage.getItem('privacy-consent');
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacy-consent', 'all');
    setIsVisible(false);
    toast({
      title: "Préférences enregistrées",
      description: "Toutes les préférences de confidentialité ont été acceptées",
      variant: "success",
    });
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('privacy-consent', 'essential');
    setPreferences({
      ...preferences,
      functional: false,
      analytics: false,
      marketing: false,
      thirdParty: false
    });
    setIsVisible(false);
    toast({
      title: "Préférences enregistrées",
      description: "Seuls les cookies essentiels ont été acceptés",
      variant: "default",
    });
    if (onDecline) onDecline();
  };

  const handleSavePreferences = () => {
    localStorage.setItem('privacy-consent', 'custom');
    localStorage.setItem('privacy-preferences', JSON.stringify(preferences));
    setIsDialogOpen(false);
    setIsVisible(false);
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences de confidentialité personnalisées ont été enregistrées",
      variant: "success",
    });
    if (onCustomize) onCustomize(preferences);
  };

  const handleTogglePreference = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const bannerVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 20, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      transition: { 
        duration: 0.2 
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 p-4 z-50"
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-lg shadow-lg border p-4 sm:p-6">
                <div className="flex items-start">
                  <div className="mr-4 hidden sm:block">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-primary sm:hidden" />
                        Vos choix en matière de confidentialité
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={handleDecline}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Fermer</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, 
                      analyser le trafic et personnaliser le contenu. En cliquant sur "Accepter", vous consentez à l'utilisation 
                      de tous les cookies. Vous pouvez également personnaliser vos préférences.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 justify-end sm:justify-start">
                      <Button
                        variant="default"
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none"
                      >
                        Accepter
                      </Button>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            className="flex-1 sm:flex-none"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Personnaliser
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>Préférences de confidentialité</DialogTitle>
                            <DialogDescription>
                              Personnalisez vos choix en matière de cookies et de données
                            </DialogDescription>
                          </DialogHeader>
                          
                          <Tabs defaultValue="cookies" className="mt-4">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="cookies">Cookies</TabsTrigger>
                              <TabsTrigger value="data">Données</TabsTrigger>
                            </TabsList>
                            <TabsContent value="cookies" className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                              <div className="space-y-4 py-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor="essential">Essentiels</Label>
                                    <p className="text-xs text-muted-foreground">
                                      Nécessaires au fonctionnement du site
                                    </p>
                                  </div>
                                  <Switch 
                                    id="essential" 
                                    checked={preferences.essential} 
                                    disabled={true}
                                  />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor="functional">Fonctionnels</Label>
                                    <p className="text-xs text-muted-foreground">
                                      Permettent de mémoriser vos préférences
                                    </p>
                                  </div>
                                  <Switch 
                                    id="functional" 
                                    checked={preferences.functional} 
                                    onCheckedChange={(checked) => handleTogglePreference('functional', checked)}
                                  />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor="analytics">Analytiques</Label>
                                    <p className="text-xs text-muted-foreground">
                                      Nous aident à comprendre comment vous utilisez le site
                                    </p>
                                  </div>
                                  <Switch 
                                    id="analytics" 
                                    checked={preferences.analytics} 
                                    onCheckedChange={(checked) => handleTogglePreference('analytics', checked)}
                                  />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor="marketing">Marketing</Label>
                                    <p className="text-xs text-muted-foreground">
                                      Utilisés pour vous présenter des publicités pertinentes
                                    </p>
                                  </div>
                                  <Switch 
                                    id="marketing" 
                                    checked={preferences.marketing} 
                                    onCheckedChange={(checked) => handleTogglePreference('marketing', checked)}
                                  />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor="thirdParty">Tiers</Label>
                                    <p className="text-xs text-muted-foreground">
                                      Placés par des services externes (réseaux sociaux, etc.)
                                    </p>
                                  </div>
                                  <Switch 
                                    id="thirdParty" 
                                    checked={preferences.thirdParty} 
                                    onCheckedChange={(checked) => handleTogglePreference('thirdParty', checked)}
                                  />
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="data" className="space-y-4">
                              <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-3">
                                <div className="flex items-start gap-2">
                                  <Info className="h-4 w-4 mt-0.5 text-primary" />
                                  <p>
                                    Vos données personnelles sont traitées conformément à notre politique de confidentialité et au RGPD.
                                  </p>
                                </div>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>Vous pouvez demander l'accès à vos données à tout moment</li>
                                  <li>Vous pouvez demander la suppression de vos données</li>
                                  <li>Nous ne partageons jamais vos données sans votre consentement explicite</li>
                                </ul>
                                <p>
                                  Pour exercer vos droits RGPD, consultez la page "Mes droits & confidentialité" accessible depuis votre profil.
                                </p>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <DialogFooter className="flex justify-between items-center">
                            <Button
                              variant="ghost"
                              onClick={handleDecline}
                              type="button"
                            >
                              Refuser tout
                            </Button>
                            <Button
                              onClick={handleSavePreferences}
                              type="button"
                            >
                              Enregistrer mes choix
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        onClick={handleDecline}
                        className="flex-1 sm:flex-none"
                      >
                        Refuser
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PrivacyConsentBanner;
