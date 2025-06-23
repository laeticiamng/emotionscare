
import React from 'react';

const HeatmapVibesPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Heatmap Vibes</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Carte de Chaleur Émotionnelle</h2>
          <p className="text-muted-foreground">
            Visualisation des tendances émotionnelles
          </p>
          {/* TODO: Implémenter l'interface Heatmap Vibes complète */}
        </div>
      </div>
    </main>
  );
};

export default HeatmapVibesPage;
