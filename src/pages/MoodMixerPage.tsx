
import React from 'react';

const MoodMixerPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mood Mixer</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Mélangeur d'Humeurs</h2>
          <p className="text-muted-foreground mb-6">
            Créez votre cocktail émotionnel parfait
          </p>
          {/* TODO: Implémenter l'interface Mood Mixer complète */}
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-blue-800">Calme</span>
            </div>
            <div className="h-24 bg-yellow-200 rounded-lg flex items-center justify-center">
              <span className="text-yellow-800">Joie</span>
            </div>
            <div className="h-24 bg-green-200 rounded-lg flex items-center justify-center">
              <span className="text-green-800">Énergie</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MoodMixerPage;
