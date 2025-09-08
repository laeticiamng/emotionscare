import React from 'react';

export const PrivacyPage: React.FC<{ 'data-testid'?: string }> = ({ 'data-testid': testId }) => {
  return (
    <div className="min-h-screen bg-background" data-testid={testId}>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Politique de confidentialité</h1>
        <div className="prose prose-lg max-w-4xl">
          <p>Politique de confidentialité d'EmotionsCare...</p>
        </div>
      </div>
    </div>
  );
};