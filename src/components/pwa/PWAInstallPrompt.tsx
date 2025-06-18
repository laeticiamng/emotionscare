
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone, Wifi, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkInstallStatus = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true ||
                        document.referrer.includes('android-app://');
      
      setIsStandalone(standalone);
      setIsInstalled(standalone);
    };

    checkInstallStatus();

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Attendre un peu avant de montrer le prompt
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      }, 30000); // 30 secondes après le chargement
    };

    // Écouter l'installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      toast({
        title: "App installée !",
        description: "EmotionsCare est maintenant disponible sur votre appareil.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "Installation en cours...",
          description: "EmotionsCare sera bientôt disponible sur votre écran d'accueil.",
        });
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      toast({
        title: "Erreur d'installation",
        description: "Impossible d'installer l'application.",
        variant: "destructive"
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Réafficher après 24h
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Ne pas afficher si déjà installé ou en mode standalone
  if (isInstalled || isStandalone || !showPrompt || !deferredPrompt) {
    return null;
  }

  // Vérifier si le prompt a été dismissé récemment
  const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
  if (lastDismissed) {
    const daysSinceLastDismiss = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
    if (daysSinceLastDismiss < 1) {
      return null;
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
      >
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-6 w-6" />
                <h3 className="font-semibold">Installer EmotionsCare</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-white/90 mb-4">
              Installez notre app pour une expérience optimisée avec notifications et mode hors-ligne.
            </p>
            
            <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
              <div className="text-center">
                <Wifi className="h-4 w-4 mx-auto mb-1" />
                <span>Hors-ligne</span>
              </div>
              <div className="text-center">
                <Bell className="h-4 w-4 mx-auto mb-1" />
                <span>Notifications</span>
              </div>
              <div className="text-center">
                <Download className="h-4 w-4 mx-auto mb-1" />
                <span>Accès rapide</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDismiss}
                className="flex-1"
              >
                Plus tard
              </Button>
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1 bg-white text-purple-600 hover:bg-white/90"
              >
                <Download className="h-4 w-4 mr-1" />
                Installer
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
