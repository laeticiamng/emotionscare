
import React from 'react';

const OnboardingFlowPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Parcours d'Onboarding</h1>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-muted-foreground mb-4">
            Bienvenue dans votre parcours de découverte EmotionsCare
          </p>
          {/* TODO: Implémenter l'interface d'onboarding complète */}
          <div className="space-y-4">
            <div className="h-4 bg-primary/20 rounded animate-pulse"></div>
            <div className="h-4 bg-primary/20 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-primary/20 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OnboardingFlowPage;
