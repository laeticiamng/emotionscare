
import React from 'react';

const VRGalactiquePage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">VR Galactique</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Voyage Galactique</h2>
          <p className="text-muted-foreground">
            Exploration VR de l'espace pour la méditation
          </p>
          {/* TODO: Implémenter l'interface VR Galactique complète */}
        </div>
      </div>
    </main>
  );
};

export default VRGalactiquePage;
