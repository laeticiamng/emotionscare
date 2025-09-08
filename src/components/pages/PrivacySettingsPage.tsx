import React from 'react';

export const PrivacySettingsPage: React.FC<{ 'data-testid'?: string }> = ({ 'data-testid': testId }) => {
  return (
    <div className="min-h-screen bg-background" data-testid={testId}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Paramètres de confidentialité</h1>
        <p>Configuration de la confidentialité...</p>
      </div>
    </div>
  );
};