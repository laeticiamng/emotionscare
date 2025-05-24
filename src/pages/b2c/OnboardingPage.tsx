
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2COnboardingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue</CardTitle>
          <CardDescription>Configuration de votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Processus d'onboarding à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
