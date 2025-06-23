
import React from 'react';

const EmotionScanPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Scanner Émotionnel</h1>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-muted-foreground mb-4">
            Analysez votre état émotionnel en temps réel
          </p>
          {/* TODO: Implémenter l'interface de scan émotionnel complète */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-medium">Scanner Vocal</span>
            </div>
            <div className="h-32 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-medium">Scanner Facial</span>
            </div>
            <div className="h-32 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-medium">Scanner Textuel</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmotionScanPage;
