
import React from 'react';

const BossLevelGritPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Boss Level Grit</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Défis de Résilience</h2>
          <p className="text-muted-foreground mb-6">
            Développez votre détermination et votre persévérance
          </p>
          {/* TODO: Implémenter l'interface Boss Level Grit complète */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold">Niveau 1</span>
            </div>
            <div className="h-32 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 font-bold">Boss Final</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BossLevelGritPage;
