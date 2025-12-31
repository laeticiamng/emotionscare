// @ts-nocheck
/**
 * B2B User Music Page - Musicothérapie avec SEO
 */
import React, { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';

// Lazy load pour performance
const MusicTherapyPage = React.lazy(() => import('@/pages/MusicTherapyPage'));

const MusicPage: React.FC = () => {
  usePageSEO({
    title: 'Musicothérapie - EmotionsCare',
    description: 'Harmonisez votre humeur avec des sons adaptatifs et de la musicothérapie personnalisée.',
    keywords: ['musique', 'thérapie', 'bien-être', 'relaxation', 'EmotionsCare'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1500);
    }
  }, [runAudit]);

  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement de la musicothérapie...</div>
      </div>
    }>
      <MusicTherapyPage />
    </React.Suspense>
  );
};

export default MusicPage;
