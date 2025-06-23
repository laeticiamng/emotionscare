
import React from 'react';

const VRHubPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hub Réalité Virtuelle</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">Méditation VR</h3>
            <p className="text-muted-foreground">Expériences immersives de relaxation</p>
            {/* TODO: Implémenter l'interface VR complète */}
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">Thérapie VR</h3>
            <p className="text-muted-foreground">Environnements thérapeutiques virtuels</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">Entraînement VR</h3>
            <p className="text-muted-foreground">Exercices de gestion du stress</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VRHubPage;
