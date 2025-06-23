
import React from 'react';

const InstantGlowWidgetPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Widget Éclat Instantané</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Bien-être Instantané</h2>
          <p className="text-muted-foreground">
            Widget pour un boost de bien-être immédiat
          </p>
          {/* TODO: Implémenter l'interface Instant Glow Widget complète */}
        </div>
      </div>
    </main>
  );
};

export default InstantGlowWidgetPage;
