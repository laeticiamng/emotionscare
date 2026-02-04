/**
 * ScanOfflineMode - Mode hors-ligne pour analyse émotionnelle locale
 * Permet l'analyse basique sans connexion internet
 */

import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WifiOff, Wifi, CloudUpload, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface OfflineScan {
  id: string;
  timestamp: Date;
  textInput: string;
  localAnalysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    keywords: string[];
  };
  synced: boolean;
}

interface ScanOfflineModeProps {
  userId?: string;
  onSync?: (scans: OfflineScan[]) => void;
}

const OFFLINE_STORAGE_KEY = 'emotionscare_offline_scans';

const ScanOfflineMode = memo(({ userId, onSync }: ScanOfflineModeProps) => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineScans, setOfflineScans] = useState<OfflineScan[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Charger les scans offline sauvegardés
    loadOfflineScans();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineScans = () => {
    try {
      const saved = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setOfflineScans(parsed.map((s: OfflineScan) => ({
          ...s,
          timestamp: new Date(s.timestamp)
        })));
      }
    } catch (error) {
      logger.error('Erreur chargement scans offline', error as Error, 'SCAN');
    }
  };

  const saveOfflineScans = (scans: OfflineScan[]) => {
    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(scans));
    } catch (error) {
      logger.error('Erreur sauvegarde scans offline', error as Error, 'SCAN');
    }
  };

  const analyzeLocally = (text: string): OfflineScan['localAnalysis'] => {
    const positiveWords = ['heureux', 'content', 'bien', 'super', 'génial', 'fantastique', 'joie', 'amour', 'paix', 'serein', 'happy', 'good', 'great'];
    const negativeWords = ['triste', 'anxieux', 'stressé', 'mal', 'peur', 'colère', 'frustré', 'déprimé', 'fatigué', 'sad', 'bad', 'angry'];

    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    const foundKeywords: string[] = [];

    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) {
        positiveCount++;
        if (!foundKeywords.includes(word)) foundKeywords.push(word);
      }
      if (negativeWords.some(nw => word.includes(nw))) {
        negativeCount++;
        if (!foundKeywords.includes(word)) foundKeywords.push(word);
      }
    });

    const total = positiveCount + negativeCount;
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let confidence = 0.5;

    if (total > 0) {
      const ratio = positiveCount / total;
      if (ratio > 0.6) {
        sentiment = 'positive';
        confidence = Math.min(0.95, 0.5 + ratio * 0.4);
      } else if (ratio < 0.4) {
        sentiment = 'negative';
        confidence = Math.min(0.95, 0.5 + (1 - ratio) * 0.4);
      }
    }

    return { sentiment, confidence, keywords: foundKeywords.slice(0, 5) };
  };

  const handleOfflineScan = () => {
    if (!textInput.trim()) {
      toast({
        title: 'Texte requis',
        description: 'Veuillez entrer du texte à analyser',
        variant: 'destructive'
      });
      return;
    }

    const localAnalysis = analyzeLocally(textInput);
    const newScan: OfflineScan = {
      id: `offline_${Date.now()}`,
      timestamp: new Date(),
      textInput: textInput.trim(),
      localAnalysis,
      synced: false
    };

    const updatedScans = [...offlineScans, newScan];
    setOfflineScans(updatedScans);
    saveOfflineScans(updatedScans);
    setTextInput('');

    toast({
      title: 'Analyse locale effectuée',
      description: `Sentiment: ${localAnalysis.sentiment} (${Math.round(localAnalysis.confidence * 100)}% confiance)`
    });

    logger.info('Scan offline créé', { scanId: newScan.id }, 'SCAN');
  };

  const syncOfflineScans = async () => {
    if (!isOnline) {
      toast({
        title: 'Hors ligne',
        description: 'Connexion internet requise pour synchroniser',
        variant: 'destructive'
      });
      return;
    }

    const unsynced = offlineScans.filter(s => !s.synced);
    if (unsynced.length === 0) {
      toast({ title: 'Tout est synchronisé', description: 'Aucun scan en attente' });
      return;
    }

    setSyncing(true);
    try {
      // Simulation de sync - en production, appeler l'API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const syncedScans = offlineScans.map(s => ({ ...s, synced: true }));
      setOfflineScans(syncedScans);
      saveOfflineScans(syncedScans);

      onSync?.(syncedScans);

      toast({
        title: 'Synchronisation réussie',
        description: `${unsynced.length} scan(s) synchronisé(s)`
      });

      logger.info('Scans offline synchronisés', { count: unsynced.length }, 'SCAN');
    } catch (error) {
      logger.error('Erreur sync offline', error as Error, 'SCAN');
      toast({
        title: 'Erreur de synchronisation',
        description: 'Veuillez réessayer plus tard',
        variant: 'destructive'
      });
    } finally {
      setSyncing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const unsyncedCount = offlineScans.filter(s => !s.synced).length;

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Mode Hors-Ligne
          </div>
          <Badge variant={isOnline ? 'default' : 'secondary'} className="flex items-center gap-1">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Zone de saisie */}
        <div className="space-y-2">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Décrivez vos émotions pour une analyse locale..."
            className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-none"
            aria-label="Texte à analyser"
          />
          <Button 
            onClick={handleOfflineScan} 
            className="w-full"
            disabled={!textInput.trim()}
          >
            Analyser localement
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">{offlineScans.length}</div>
            <div className="text-sm text-muted-foreground">Scans locaux</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">{unsyncedCount}</div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </div>
        </div>

        {/* Bouton sync */}
        {unsyncedCount > 0 && (
          <Button 
            onClick={syncOfflineScans} 
            variant="outline" 
            className="w-full"
            disabled={syncing || !isOnline}
          >
            {syncing ? (
              <>
                <CloudUpload className="h-4 w-4 mr-2 animate-pulse" />
                Synchronisation...
              </>
            ) : (
              <>
                <CloudUpload className="h-4 w-4 mr-2" />
                Synchroniser ({unsyncedCount})
              </>
            )}
          </Button>
        )}

        {/* Liste des scans récents */}
        {offlineScans.length > 0 && (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            <h4 className="text-sm font-medium">Scans récents</h4>
            {offlineScans.slice(-5).reverse().map(scan => (
              <div key={scan.id} className="p-2 rounded-lg bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getSentimentColor(scan.localAnalysis.sentiment)}`} />
                  <span className="text-sm truncate max-w-[150px]">{scan.textInput}</span>
                </div>
                {scan.synced ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info hors-ligne */}
        {!isOnline && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
            <p className="text-yellow-600 dark:text-yellow-400">
              Mode hors-ligne actif. L'analyse utilise des algorithmes locaux simplifiés. 
              Une analyse complète sera effectuée lors de la synchronisation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ScanOfflineMode.displayName = 'ScanOfflineMode';

export default ScanOfflineMode;
