// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Smartphone, Download, Wifi, Bell, Share, Home, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export const AdvancedPWAFeatures: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [offlineData, setOfflineData] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        toast.success('Application installée avec succès!');
      }
      setInstallPrompt(null);
    }
  };

  const enableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success('Notifications activées');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'activation des notifications');
    }
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EmotionsCare',
          text: 'Découvrez EmotionsCare, votre compagnon bien-être',
          url: window.location.origin
        });
      } catch (error) {
        logger.info('Partage annulé', {}, 'UI');
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Fonctionnalités PWA Avancées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className={`w-5 h-5 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
                <span>Connexion</span>
              </div>
              <Badge className={isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Home className={`w-5 h-5 ${isInstalled ? 'text-green-500' : 'text-gray-500'}`} />
                <span>Installation</span>
              </div>
              <Badge className={isInstalled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {isInstalled ? 'Installée' : 'Non installée'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className={`w-5 h-5 ${notificationsEnabled ? 'text-green-500' : 'text-gray-500'}`} />
                <span>Notifications</span>
              </div>
              <Badge className={notificationsEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {notificationsEnabled ? 'Activées' : 'Désactivées'}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {!isInstalled && installPrompt && (
              <Button onClick={installApp} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Installer l'application
              </Button>
            )}

            {!notificationsEnabled && (
              <Button onClick={enableNotifications} variant="outline" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Activer les notifications
              </Button>
            )}

            <Button onClick={shareApp} variant="outline" className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              Partager l'app
            </Button>
          </div>

          {/* Offline Capabilities */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Capacités Hors-ligne
            </h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>✅ Navigation complète de l'interface</li>
              <li>✅ Sauvegarde automatique des données</li>
              <li>✅ Synchronisation à la reconnexion</li>
              <li>✅ Cache intelligent des ressources</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};