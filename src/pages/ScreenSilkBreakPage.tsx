
import React from 'react';

const ScreenSilkBreakPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Screen Silk Break</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Pause Écran Soie</h2>
          <p className="text-muted-foreground">
            Pauses douces pour vos yeux et votre esprit
          </p>
          {/* TODO: Implémenter l'interface Screen Silk Break complète */}
        </div>
      </div>
    </main>
  );
};

export default ScreenSilkBreakPage;
