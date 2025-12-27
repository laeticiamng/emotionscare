/**
 * MusicGeneratorSection - Section génération IA avec lazy loading
 */

import React, { Suspense, lazy } from 'react';
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

interface MusicGeneratorSectionProps {
  currentEmotion: string;
  userId: string;
}

export const MusicGeneratorSection: React.FC<MusicGeneratorSectionProps> = ({
  currentEmotion,
  userId
}) => {
  const { toast } = useToast();

  return (
    <>
      {/* Suno Service Status */}
      <div className="max-w-4xl mx-auto mb-8">
        <Suspense fallback={<LoadingFallback />}>
          <SunoServiceStatus />
        </Suspense>
      </div>

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
            onApplySunoParams={(params) => {
              toast({
                title: 'Paramètres Suno appliqués',
                description: `Style: ${params.optimalStyle}, BPM: ${params.optimalBpm}`,
              });
              logger.info('Suno params applied', params, 'ML');
            }}
          />
        </Suspense>
      </div>
    </>
  );
};

export default MusicGeneratorSection;
