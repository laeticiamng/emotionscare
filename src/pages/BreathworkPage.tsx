
import React from 'react';

const BreathworkPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Travail Respiratoire</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Exercices de Respiration</h2>
          <p className="text-muted-foreground">
            Techniques de respiration pour la relaxation
          </p>
          {/* TODO: Implémenter l'interface Breathwork complète */}
        </div>
      </div>
    </main>
  );
};

export default BreathworkPage;
