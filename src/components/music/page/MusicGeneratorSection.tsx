/**
 * MusicGeneratorSection - Section génération IA avec lazy loading
 * Connecte le panneau ML au générateur de musique
 */

import React, { Suspense, lazy, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

const EmotionalMusicGenerator = lazy(() => import('@/components/music/EmotionalMusicGenerator').then(m => ({ default: m.EmotionalMusicGenerator })));
const MLRecommendationsPanel = lazy(() => import('@/components/ml/MLRecommendationsPanel').then(m => ({ default: m.MLRecommendationsPanel })));
const SunoServiceStatus = lazy(() => import('@/components/music/SunoServiceStatus').then(m => ({ default: m.SunoServiceStatus })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

interface OptimizedSunoParams {
  optimalBpm: number;
  optimalStyle: string;
  optimalMood: string;
  optimalTags: string[];
  intensity: number;
  confidence: number;
}

interface MusicGeneratorSectionProps {
  currentEmotion: string;
  userId: string;
}

export const MusicGeneratorSection: React.FC<MusicGeneratorSectionProps> = ({
  currentEmotion,
  userId
}) => {
  const { toast } = useToast();
  const [appliedParams, setAppliedParams] = useState<OptimizedSunoParams | null>(null);

  const handleApplySunoParams = useCallback((params: OptimizedSunoParams) => {
    setAppliedParams(params);
    
    // Store in sessionStorage for EmotionalMusicGenerator to pick up
    sessionStorage.setItem('ml_suno_params', JSON.stringify({
      style: params.optimalStyle,
      mood: params.optimalMood,
      bpm: params.optimalBpm,
      tags: params.optimalTags,
      intensity: params.intensity,
    }));
    
    toast({
      title: '✨ Paramètres ML appliqués',
      description: `Style: ${params.optimalStyle}, BPM: ${params.optimalBpm}, Confiance: ${Math.round(params.confidence * 100)}%`,
    });
    logger.info('Suno params applied from ML', params, 'ML');
  }, [toast]);

  return (
    <>
      {/* Suno Service Status */}
      <div className="max-w-4xl mx-auto mb-8">
        <Suspense fallback={<LoadingFallback />}>
          <SunoServiceStatus />
        </Suspense>
      </div>

      {/* Applied ML Params Indicator */}
      {appliedParams && (
        <div className="max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-primary">Paramètres ML actifs:</span>
              <span className="ml-2 text-muted-foreground">
                {appliedParams.optimalStyle} • {appliedParams.optimalBpm} BPM • {appliedParams.optimalMood}
              </span>
            </div>
            <button 
              onClick={() => {
                setAppliedParams(null);
                sessionStorage.removeItem('ml_suno_params');
                toast({ title: 'Paramètres ML désactivés' });
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* AI Emotional Music Generator */}
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <EmotionalMusicGenerator />
        </Suspense>
      </div>

      {/* ML Recommendations Panel */}
      <div className="max-w-4xl mx-auto mt-8">
        <Suspense fallback={<LoadingFallback />}>
          <MLRecommendationsPanel 
            currentEmotion={currentEmotion}
            userId={userId}
            onApplySunoParams={handleApplySunoParams}
          />
        </Suspense>
      </div>
    </>
  );
};

export default MusicGeneratorSection;
