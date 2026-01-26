// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { logger } from '@/lib/logger';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const hasDeclined = localStorage.getItem('pwa-install-declined');
      if (!hasDeclined) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    checkIfInstalled();
    
    if (!isInstalled) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      } else {
        localStorage.setItem('pwa-install-declined', 'true');
      }
      
      setShowPrompt(false);
    } catch (error) {
      logger.error('Error during PWA installation', error as Error, 'SYSTEM');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-declined', 'true');
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-card border rounded-lg shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Download className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground mb-1">
              Installer EmotionsCare
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Accédez rapidement à vos outils de bien-être.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded text-sm hover:bg-primary/90"
              >
                Installer
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-muted-foreground hover:bg-accent rounded text-sm"
              >
                Plus tard
              </button>
            </div>
          </div>
          
          <button onClick={handleDismiss} className="p-1 hover:bg-accent rounded">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;