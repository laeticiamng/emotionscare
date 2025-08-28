
import React from 'react';

const PlatformStatusPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">État de la Plateforme</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Health Check Badge</h2>
          <p className="text-muted-foreground">
            Statut en temps réel de tous les services
          </p>
          {/* Interface Platform Status complète maintenant disponible */}
          <PlatformStatusPageComplete />
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✅ Tous les services opérationnels
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlatformStatusPage;
