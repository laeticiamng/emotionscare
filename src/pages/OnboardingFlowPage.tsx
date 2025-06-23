
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OnboardingFlowPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Onboarding Flow</h1>
        <Card>
          <CardHeader>
            <CardTitle>Parcours d'intégration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Guide interactif pour découvrir EmotionsCare.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlowPage;
