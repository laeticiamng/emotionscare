
import React from 'react';

const InAppFeedbackPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Feedback In-App</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Votre Avis Compte</h2>
          <p className="text-muted-foreground">
            Partagez vos suggestions d'amélioration
          </p>
          {/* TODO: Implémenter l'interface In-App Feedback complète */}
        </div>
      </div>
    </main>
  );
};

export default InAppFeedbackPage;
