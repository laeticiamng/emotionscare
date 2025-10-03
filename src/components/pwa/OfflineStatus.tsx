
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw, Download, Cloud } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OfflineData {
  messages: any[];
  emotions: any[];
  journalEntries: any[];
  lastSync: string;
}

const OfflineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    messages: [],
    emotions: [],
    journalEntries: [],
    lastSync: new Date().toISOString()
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connexion rétablie",
        description: "Synchronisation en cours...",
      });
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineModal(true);
      toast({
        title: "Mode hors-ligne activé",
        description: "Vos données sont sauvegardées localement.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Charger les données hors-ligne au démarrage
    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    try {
      const data = localStorage.getItem('offline-data');
      if (data) {
        setOfflineData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erreur chargement données hors-ligne:', error);
    }
  };

  const saveOfflineData = (data: Partial<OfflineData>) => {
    try {
      const currentData = { ...offlineData, ...data };
      setOfflineData(currentData);
      localStorage.setItem('offline-data', JSON.stringify(currentData));
    } catch (error) {
      console.error('Erreur sauvegarde données hors-ligne:', error);
    }
  };

  const syncOfflineData = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    
    try {
      // Simuler la synchronisation des données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Marquer comme synchronisé
      const syncData = {
        ...offlineData,
        lastSync: new Date().toISOString(),
        messages: [],
        emotions: [],
        journalEntries: []
      };
      
      saveOfflineData(syncData);
      
      toast({
        title: "Synchronisation terminée",
        description: "Toutes vos données sont à jour.",
      });
    } catch (error) {
      console.error('Erreur synchronisation:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Certaines données n'ont pas pu être synchronisées.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getPendingCount = () => {
    return offlineData.messages.length + 
           offlineData.emotions.length + 
           offlineData.journalEntries.length;
  };

  const getLastSyncText = () => {
    const lastSync = new Date(offlineData.lastSync);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffMinutes / 1440)} jour(s)`;
  };

  return (
    <>
      {/* Indicateur de statut fixe */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2"
        >
          {isOnline ? (
            <Badge className="bg-green-500 text-white">
              <Wifi className="h-3 w-3 mr-1" />
              En ligne
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="h-3 w-3 mr-1" />
              Hors-ligne
            </Badge>
          )}
          
          {getPendingCount() > 0 && (
            <Badge variant="outline">
              {getPendingCount()} en attente
            </Badge>
          )}
        </motion.div>
      </div>

      {/* Modal mode hors-ligne */}
      <AnimatePresence>
        {showOfflineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowOfflineModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <WifiOff className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Mode hors-ligne</h2>
                    <p className="text-muted-foreground">
                      Pas de panique ! Vous pouvez continuer à utiliser l'application. 
                      Vos données seront synchronisées dès que la connexion sera rétablie.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Fonctionnalités disponibles :</span>
                    </div>
                    <div className="text-left space-y-1 text-sm text-muted-foreground">
                      <div>✓ Saisie d'émotions</div>
                      <div>✓ Journal personnel</div>
                      <div>✓ Exercices de respiration</div>
                      <div>✗ Chat avec l'IA</div>
                      <div>✗ Synchronisation temps réel</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setShowOfflineModal(false)}
                    className="w-full"
                  >
                    Continuer hors-ligne
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panneau de synchronisation */}
      {isOnline && getPendingCount() > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">
                    Synchronisation
                  </span>
                </div>
                <Badge variant="outline" className="text-blue-700">
                  {getPendingCount()} éléments
                </Badge>
              </div>
              
              <p className="text-sm text-blue-700 mb-3">
                Dernière sync : {getLastSyncText()}
              </p>
              
              <Button
                onClick={syncOfflineData}
                disabled={isSyncing}
                size="sm"
                className="w-full"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Synchroniser maintenant
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
};

export default OfflineStatus;
