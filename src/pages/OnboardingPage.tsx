
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OnboardingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Intégration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Page Onboarding - Contenu à venir
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
