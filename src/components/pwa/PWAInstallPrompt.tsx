
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { pwaManager } from '@/lib/pwa/pwaManager';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleInstallAvailable = () => {
      setShowPrompt(true);
    };

    const handleInstallCompleted = () => {
      setShowPrompt(false);
    };

    const handleUpdateAvailable = () => {
      setShowUpdate(true);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaManager.installApp();
      if (success) {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Erreur installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await pwaManager.updateApp();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Ne plus afficher pendant cette session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const dismissUpdate = () => {
    setShowUpdate(false);
  };

  return (
    <>
      <AnimatePresence>
        {showPrompt && !sessionStorage.getItem('pwa-prompt-dismissed') && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <Card className="border-primary/20 bg-background/95 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Installer EmotionsCare</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissPrompt}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Installez l'application pour un accès rapide et une expérience optimisée
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isInstalling ? 'Installation...' : 'Installer'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={dismissPrompt}
                  >
                    Plus tard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <Card className="border-blue-500/20 bg-blue-50/95 dark:bg-blue-950/95 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                    Mise à jour disponible
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissUpdate}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Une nouvelle version est disponible avec des améliorations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Mettre à jour
                  </Button>
                  <Button
                    variant="outline"
                    onClick={dismissUpdate}
                  >
                    Ignorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstallPrompt;
