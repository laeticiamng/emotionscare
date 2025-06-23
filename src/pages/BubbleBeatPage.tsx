
import React from 'react';

const BubbleBeatPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bubble Beat</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Rythme Bulle</h2>
          <p className="text-muted-foreground">
            Synchronisation émotionnelle par le rythme
          </p>
          {/* TODO: Implémenter l'interface Bubble Beat complète */}
        </div>
      </div>
    </main>
  );
};

export default BubbleBeatPage;
