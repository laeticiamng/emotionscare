/**
 * Page de scan B2C avec infrastructure complète intégrée
 * Utilise validation, observabilité, accessibilité, i18n et performance
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Mic, 
  FileText, 
  Brain, 
  Music,
  Activity,
  Heart,
  Zap,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validateData } from '@/lib/data-validation';
import { useObservability } from '@/lib/observability';
import { useTranslation } from '@/lib/i18n-core';
import { usePerformanceOptimization } from '@/lib/performance-optimizer';
import { AccessibilityProvider, EnhancedSkipLinks } from '@/components/layout/AccessibilityEnhanced';
import { useCriticalUserJourney } from '@/hooks/useCriticalUserJourney';

// Types pour le scan émotionnel
interface EmotionScanResult {
  id: string;
  timestamp: string;
  emotion: string;
  confidence: number;
  intensity: number;
  source: 'facial' | 'voice' | 'text';
  metadata?: Record<string, any>;
}

interface ScanState {
  isScanning: boolean;
  currentSource: 'facial' | 'voice' | 'text' | null;
  progress: number;
  results: EmotionScanResult[];
  error: string | null;
}

const EnhancedB2CScanPage: React.FC = () => {
  const { t } = useTranslation();
  const { logPageView, logUserAction, logError, measureOperation } = useObservability();
  const { cache, preload } = usePerformanceOptimization();
  const journey = useCriticalUserJourney('emotion_scan');

  const [scanState, setScanState] = useState<ScanState>({
    isScanning: false,
    currentSource: null,
    progress: 0,
    results: [],
    error: null,
  });

  // Initialisation avec observabilité et journey
  useEffect(() => {
    logPageView('scan_page');
    journey.startJourney('emotion_scan');
    
    // Précharger les ressources nécessaires
    preload('/api/emotion-scan', 'fetch');
    preload('/app/music', 'fetch');
    
    return () => {
      if (journey.isInJourney) {
        journey.abandonJourney('page_unmount');
      }
    };
  }, [logPageView, journey, preload]);

  // Fonction de scan avec validation et observabilité
  const handleStartScan = useCallback(async (source: 'facial' | 'voice' | 'text') => {
    logUserAction('scan_started', { source });
    measureOperation.start(`scan_${source}`);
    
    setScanState(prev => ({
      ...prev,
      isScanning: true,
      currentSource: source,
      progress: 0,
      error: null,
    }));

    try {
      // Simulation de progression avec observabilité
      const progressInterval = setInterval(() => {
        setScanState(prev => {
          const newProgress = Math.min(prev.progress + 10, 90);
          return { ...prev, progress: newProgress };
        });
      }, 200);

      // Simulation d'API call avec cache
      const cacheKey = `scan_${source}_${Date.now()}`;
      const scanResult = await cache(cacheKey, async () => {
        // Simulation d'analyse
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const emotions = ['happy', 'calm', 'focused', 'energetic', 'sad', 'anxious'];
        const emotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        return {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          emotion,
          confidence: 0.7 + Math.random() * 0.3,
          intensity: 0.4 + Math.random() * 0.6,
          source,
          metadata: {
            processingTime: measureOperation.end(`scan_${source}`),
            deviceType: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
          },
        };
      });

      clearInterval(progressInterval);
      
      // Validation des données
      const validation = validateData(
        // Schéma simple de validation
        {
          parse: (data: any) => {
            if (!data.emotion || !data.confidence) {
              throw new Error('Données de scan invalides');
            }
            return data;
          }
        } as any,
        scanResult
      );

      if (!validation.success) {
        throw new Error('Validation des résultats échouée');
      }

      setScanState(prev => ({
        ...prev,
        isScanning: false,
        progress: 100,
        results: [scanResult, ...prev.results.slice(0, 9)],
        currentSource: null,
      }));

      // Compléter l'étape du journey
      journey.completeStep('scan_process', { 
        emotion: scanResult.emotion,
        confidence: scanResult.confidence,
        source 
      });

      toast({
        title: "Analyse terminée !",
        description: `Émotion "${scanResult.emotion}" détectée avec ${Math.round(scanResult.confidence * 100)}% de confiance`,
      });

      logUserAction('scan_completed', {
        source,
        emotion: scanResult.emotion,
        confidence: scanResult.confidence,
      });

    } catch (error) {
      measureOperation.end(`scan_${source}`);
      logError(error as Error, 'Erreur lors du scan émotionnel', { source });
      
      setScanState(prev => ({
        ...prev,
        isScanning: false,
        error: (error as Error).message,
        currentSource: null,
      }));

      toast({
        title: "Erreur d'analyse",
        description: "Une erreur est survenue lors du scan. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }, [logUserAction, measureOperation, cache, journey, toast, logError]);

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-100 text-yellow-800',
      calm: 'bg-blue-100 text-blue-800',
      focused: 'bg-purple-100 text-purple-800',
      energetic: 'bg-orange-100 text-orange-800',
      sad: 'bg-gray-100 text-gray-800',
      anxious: 'bg-red-100 text-red-800',
    };
    return colors[emotion] || 'bg-gray-100 text-gray-800';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      happy: '😊',
      calm: '😌',
      focused: '🎯',
      energetic: '⚡',
      sad: '😔',
      anxious: '😰',
    };
    return emojis[emotion] || '😐';
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 p-4 md:p-6">
        <EnhancedSkipLinks />
        
        <div className="max-w-4xl mx-auto space-y-6" data-testid="page-root">
          {/* En-tête avec journey progress */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t('module.scan')} EmotionsCare
            </h1>
            <p className="text-lg text-muted-foreground">
              Analysez vos émotions en temps réel avec notre IA avancée
            </p>
            
            {journey.isInJourney && (
              <div className="max-w-sm mx-auto">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progression</span>
                  <span>{journey.getProgress().current} / {journey.getProgress().total}</span>
                </div>
                <Progress value={journey.getProgress().percentage} className="h-2" />
              </div>
            )}
          </div>

          {/* Options de scan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Choisissez votre méthode d'analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleStartScan('facial')}
                  disabled={scanState.isScanning}
                  className="h-24 flex-col gap-2 p-4"
                  variant={scanState.currentSource === 'facial' ? 'default' : 'outline'}
                >
                  <Camera className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Analyse Faciale</div>
                    <div className="text-xs opacity-70">Reconnaissance d'expressions</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleStartScan('voice')}
                  disabled={scanState.isScanning}
                  className="h-24 flex-col gap-2 p-4"
                  variant={scanState.currentSource === 'voice' ? 'default' : 'outline'}
                >
                  <Mic className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Analyse Vocale</div>
                    <div className="text-xs opacity-70">Tons et intonations</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleStartScan('text')}
                  disabled={scanState.isScanning}
                  className="h-24 flex-col gap-2 p-4"
                  variant={scanState.currentSource === 'text' ? 'default' : 'outline'}
                >
                  <FileText className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Analyse Textuelle</div>
                    <div className="text-xs opacity-70">Sentiment et contexte</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* État du scan */}
          {scanState.isScanning && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <div>
                    <h3 className="font-semibold">Analyse en cours...</h3>
                    <p className="text-sm text-muted-foreground">
                      Traitement {scanState.currentSource} avec IA avancée
                    </p>
                  </div>
                  <Progress value={scanState.progress} className="w-full max-w-sm mx-auto" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Erreur */}
          {scanState.error && (
            <Card className="border-destructive">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-destructive font-semibold">Erreur d'analyse</div>
                  <p className="text-sm text-muted-foreground">{scanState.error}</p>
                  <Button 
                    onClick={() => setScanState(prev => ({ ...prev, error: null }))}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Résultats récents */}
          {scanState.results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Résultats récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanState.results.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getEmotionEmoji(result.emotion)}</span>
                        <div>
                          <div className="font-semibold capitalize">{result.emotion}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(result.timestamp).toLocaleTimeString('fr-FR')} - {result.source}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge className={getEmotionColor(result.emotion)}>
                          {Math.round(result.confidence * 100)}%
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Intensité: {Math.round(result.intensity * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions suivantes */}
          {scanState.results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Que souhaitez-vous faire ensuite ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Music className="h-5 w-5" />
                    <span className="text-sm">Musique thérapeutique</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Heart className="h-5 w-5" />
                    <span className="text-sm">Exercices de respiration</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm">Journal émotionnel</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AccessibilityProvider>
  );
};

export default EnhancedB2CScanPage;