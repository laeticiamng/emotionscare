
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MoodMixerPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mood Mixer</h1>
        <Card>
          <CardHeader>
            <CardTitle>Mélangez vos humeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Outil interactif pour explorer et ajuster votre état émotionnel.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodMixerPage;
