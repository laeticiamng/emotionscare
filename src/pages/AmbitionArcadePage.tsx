
import React from 'react';

const AmbitionArcadePage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ambition Arcade</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Jeux d'Ambition</h2>
          <p className="text-muted-foreground mb-6">
            Transformez vos objectifs en jeux motivants
          </p>
          {/* TODO: Implémenter l'interface Ambition Arcade complète */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-32 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600">🎯 Objectifs</span>
            </div>
            <div className="h-32 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">🏆 Récompenses</span>
            </div>
            <div className="h-32 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">📈 Progrès</span>
            </div>
            <div className="h-32 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600">⭐ Défis</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AmbitionArcadePage;
