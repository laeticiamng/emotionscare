
import React from 'react';

const StorySynthLabPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Story Synth Lab</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Laboratoire de Synthèse d'Histoires</h2>
          <p className="text-muted-foreground">
            Créez des narratifs thérapeutiques personnalisés
          </p>
          {/* TODO: Implémenter l'interface Story Synth Lab complète */}
        </div>
      </div>
    </main>
  );
};

export default StorySynthLabPage;
