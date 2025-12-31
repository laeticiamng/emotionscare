/**
 * useMultiSourceScan - Hook pour combiner les analyses multi-sources
 * Fusionne les résultats de scans texte, vocal et facial en un profil unifié
 */

import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEmotionScan } from '@/hooks/useEmotionScan';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface MultiSourceResult {
  id: string;
  timestamp: string;
  sources: {
    text?: SourceResult;
    voice?: SourceResult;
    facial?: SourceResult;
  };
  fusion: {
    emotion: string;
    valence: number;
    arousal: number;
    confidence: number;
    dominance?: number;
  };
  insights: string[];
  reliability: 'high' | 'medium' | 'low';
}

export interface SourceResult {
  emotion: string;
  valence: number;
  arousal: number;
  confidence: number;
  timestamp: string;
}

interface FusionWeights {
  text: number;
  voice: number;
  facial: number;
}

const DEFAULT_WEIGHTS: FusionWeights = {
  text: 0.3,
  voice: 0.35,
  facial: 0.35
};

export function useMultiSourceScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<MultiSourceResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeSource, setActiveSource] = useState<'text' | 'voice' | 'facial' | null>(null);
  const { toast } = useToast();
  const { analyzeText, analyzeVoice, analyzeImage } = useEmotionScan();

  // Fusion des résultats multi-sources avec pondération
  const fuseResults = useCallback((
    sources: MultiSourceResult['sources'],
    weights: FusionWeights = DEFAULT_WEIGHTS
  ): MultiSourceResult['fusion'] => {
    const validSources = Object.entries(sources).filter(([_, v]) => v !== undefined);
    
    if (validSources.length === 0) {
      return {
        emotion: 'neutre',
        valence: 50,
        arousal: 50,
        confidence: 0
      };
    }

    // Normaliser les poids en fonction des sources disponibles
    const totalWeight = validSources.reduce((sum, [key]) => {
      return sum + weights[key as keyof FusionWeights];
    }, 0);

    let weightedValence = 0;
    let weightedArousal = 0;
    let weightedConfidence = 0;
    const emotionCounts: Record<string, number> = {};

    validSources.forEach(([key, source]) => {
      if (!source) return;
      const weight = weights[key as keyof FusionWeights] / totalWeight;
      
      weightedValence += source.valence * weight;
      weightedArousal += source.arousal * weight;
      weightedConfidence += source.confidence * weight;
      
      // Compter les émotions pour le consensus
      const emotion = source.emotion.toLowerCase();
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + weight;
    });

    // Déterminer l'émotion dominante par consensus pondéré
    const dominantEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutre';

    return {
      emotion: dominantEmotion,
      valence: Math.round(weightedValence),
      arousal: Math.round(weightedArousal),
      confidence: Math.round(weightedConfidence)
    };
  }, []);

  // Générer des insights basés sur la fusion
  const generateInsights = useCallback((
    sources: MultiSourceResult['sources'],
    fusion: MultiSourceResult['fusion']
  ): string[] => {
    const insights: string[] = [];
    const sourceCount = Object.values(sources).filter(Boolean).length;

    // Insight sur la cohérence
    if (sourceCount >= 2) {
      const valences = Object.values(sources)
        .filter(Boolean)
        .map(s => s!.valence);
      const variance = Math.abs(Math.max(...valences) - Math.min(...valences));
      
      if (variance < 15) {
        insights.push('✅ Forte cohérence entre les différentes sources d\'analyse.');
      } else if (variance > 30) {
        insights.push('⚠️ Divergence détectée entre les sources. L\'analyse textuelle et émotionnelle peuvent différer.');
      }
    }

    // Insight sur l'état émotionnel
    if (fusion.valence > 70 && fusion.arousal > 60) {
      insights.push('🌟 État positif et énergique détecté. Profitez de ce moment!');
    } else if (fusion.valence < 30 && fusion.arousal > 60) {
      insights.push('💪 Tension détectée. Essayez un exercice de respiration.');
    } else if (fusion.valence > 60 && fusion.arousal < 40) {
      insights.push('😌 État calme et serein. Excellent pour la réflexion.');
    } else if (fusion.valence < 40 && fusion.arousal < 40) {
      insights.push('🌱 Énergie basse. Une pause ou un peu de mouvement pourrait aider.');
    }

    // Insight sur la confiance
    if (fusion.confidence < 50) {
      insights.push('📊 Confiance modérée. Essayez un scan avec plus de sources pour plus de précision.');
    } else if (fusion.confidence > 80) {
      insights.push('🎯 Analyse très fiable basée sur plusieurs indicateurs concordants.');
    }

    return insights;
  }, []);

  // Calculer la fiabilité
  const calculateReliability = useCallback((
    sources: MultiSourceResult['sources'],
    fusion: MultiSourceResult['fusion']
  ): MultiSourceResult['reliability'] => {
    const sourceCount = Object.values(sources).filter(Boolean).length;
    
    if (sourceCount >= 3 && fusion.confidence > 70) return 'high';
    if (sourceCount >= 2 && fusion.confidence > 50) return 'medium';
    return 'low';
  }, []);

  // Scan multi-source complet
  const runMultiSourceScan = useCallback(async (inputs: {
    text?: string;
    audioBlob?: Blob;
    imageData?: string;
  }): Promise<MultiSourceResult | null> => {
    setIsScanning(true);
    setProgress(0);
    const sources: MultiSourceResult['sources'] = {};

    try {
      const totalSteps = Object.values(inputs).filter(Boolean).length;
      let completedSteps = 0;

      // Analyse textuelle
      if (inputs.text) {
        setActiveSource('text');
        try {
          const textResult = await analyzeText(inputs.text);
          sources.text = {
            emotion: textResult.emotion || 'neutre',
            valence: typeof textResult.valence === 'number' ? textResult.valence : 50,
            arousal: typeof textResult.arousal === 'number' ? textResult.arousal : 50,
            confidence: typeof textResult.confidence === 'number' ? textResult.confidence : 70,
            timestamp: new Date().toISOString()
          };
        } catch (err) {
          logger.warn('[useMultiSourceScan] Text analysis failed', {}, 'SCAN');
        }
        completedSteps++;
        setProgress((completedSteps / totalSteps) * 100);
      }

      // Analyse vocale
      if (inputs.audioBlob) {
        setActiveSource('voice');
        try {
          const voiceResult = await analyzeVoice(inputs.audioBlob);
          sources.voice = {
            emotion: voiceResult.emotion || 'neutre',
            valence: typeof voiceResult.valence === 'number' ? voiceResult.valence : 50,
            arousal: typeof voiceResult.arousal === 'number' ? voiceResult.arousal : 50,
            confidence: typeof voiceResult.confidence === 'number' ? voiceResult.confidence : 60,
            timestamp: new Date().toISOString()
          };
        } catch (err) {
          logger.warn('[useMultiSourceScan] Voice analysis failed', {}, 'SCAN');
        }
        completedSteps++;
        setProgress((completedSteps / totalSteps) * 100);
      }

      // Analyse faciale
      if (inputs.imageData) {
        setActiveSource('facial');
        try {
          const facialResult = await analyzeImage(inputs.imageData);
          sources.facial = {
            emotion: facialResult.emotion || 'neutre',
            valence: typeof facialResult.valence === 'number' ? facialResult.valence : 50,
            arousal: typeof facialResult.arousal === 'number' ? facialResult.arousal : 50,
            confidence: typeof facialResult.confidence === 'number' ? facialResult.confidence : 75,
            timestamp: new Date().toISOString()
          };
        } catch (err) {
          logger.warn('[useMultiSourceScan] Facial analysis failed', {}, 'SCAN');
        }
        completedSteps++;
        setProgress((completedSteps / totalSteps) * 100);
      }

      // Vérifier qu'au moins une source a réussi
      if (Object.values(sources).filter(Boolean).length === 0) {
        toast({
          title: 'Analyse échouée',
          description: 'Aucune source n\'a pu être analysée.',
          variant: 'destructive'
        });
        return null;
      }

      // Fusionner les résultats
      const fusion = fuseResults(sources);
      const insights = generateInsights(sources, fusion);
      const reliability = calculateReliability(sources, fusion);

      const result: MultiSourceResult = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        sources,
        fusion,
        insights,
        reliability
      };

      setResults(result);

      // Sauvegarder dans clinical_signals
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('clinical_signals').insert({
          user_id: user.id,
          domain: 'emotional',
          level: Math.round(fusion.valence / 25),
          source_instrument: 'scan_multi',
          window_type: 'instant',
          module_context: 'scan',
          metadata: {
            sources: Object.keys(sources),
            fusion,
            insights,
            reliability
          },
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        window.dispatchEvent(new CustomEvent('scan-saved'));
      }

      toast({
        title: '✅ Analyse multi-source terminée',
        description: `${Object.keys(sources).length} source(s) analysée(s) avec une fiabilité ${reliability === 'high' ? 'élevée' : reliability === 'medium' ? 'moyenne' : 'faible'}.`
      });

      return result;

    } catch (error) {
      logger.error('[useMultiSourceScan] Error:', error, 'SCAN');
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'analyse.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsScanning(false);
      setActiveSource(null);
      setProgress(100);
    }
  }, [analyzeText, analyzeVoice, analyzeImage, fuseResults, generateInsights, calculateReliability, toast]);

  // Statistiques sur les sources
  const sourceStats = useMemo(() => {
    if (!results) return null;
    
    const sources = results.sources;
    return {
      count: Object.values(sources).filter(Boolean).length,
      hasText: !!sources.text,
      hasVoice: !!sources.voice,
      hasFacial: !!sources.facial,
      coherence: (() => {
        const valences = Object.values(sources).filter(Boolean).map(s => s!.valence);
        if (valences.length < 2) return 100;
        return 100 - Math.abs(Math.max(...valences) - Math.min(...valences));
      })()
    };
  }, [results]);

  return {
    runMultiSourceScan,
    isScanning,
    results,
    progress,
    activeSource,
    sourceStats,
    reset: () => {
      setResults(null);
      setProgress(0);
      setActiveSource(null);
    }
  };
}

export default useMultiSourceScan;
