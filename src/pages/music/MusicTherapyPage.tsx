/**
 * MusicTherapyPage - Point d'entrée musicothérapie
 * Redirige vers B2CMusicEnhanced pour cohérence
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';

// Lazy load B2CMusicEnhanced
const B2CMusicEnhanced = lazy(() => import('@/pages/b2c/B2CMusicEnhanced'));

// Loading skeleton
const MusicLoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background p-8 space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="h-40 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const MusicTherapyPage: React.FC = () => {
  usePageSEO({
    title: 'Musicothérapie - EmotionsCare',
    description: 'Découvrez la musicothérapie IA personnalisée. Écoutez des musiques générées adaptées à vos émotions.',
    keywords: 'musicothérapie, musique IA, bien-être, relaxation, thérapie musicale, EmotionsCare',
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      const timer = setTimeout(runAudit, 1500);
      return () => clearTimeout(timer);
    }
  }, [runAudit]);

  return (
    <Suspense fallback={<MusicLoadingSkeleton />}>
      <B2CMusicEnhanced />
    </Suspense>
  );
};

export default MusicTherapyPage;
