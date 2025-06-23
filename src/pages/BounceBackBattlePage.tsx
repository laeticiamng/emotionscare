
import React from 'react';

const BounceBackBattlePage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bounce Back Battle</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Combat de Récupération</h2>
          <p className="text-muted-foreground">
            Développez votre capacité à rebondir après les difficultés
          </p>
          {/* TODO: Implémenter l'interface Bounce Back Battle complète */}
        </div>
      </div>
    </main>
  );
};

export default BounceBackBattlePage;
