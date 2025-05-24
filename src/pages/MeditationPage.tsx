
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';
import { GuidedSessionList } from '@/utils/lazyRoutes';

const MeditationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Méditation & Mindfulness</h1>
        <p className="text-muted-foreground">
          Découvrez nos sessions guidées pour améliorer votre bien-être mental
        </p>
      </div>

      <Suspense fallback={<ComponentLoadingFallback />}>
        <GuidedSessionList />
      </Suspense>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conseils pour débuter</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Commencez par des sessions courtes (5-10 minutes)</li>
            <li>• Trouvez un endroit calme sans distractions</li>
            <li>• Gardez une posture confortable mais droite</li>
            <li>• Soyez patient avec vous-même</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationPage;
