
import React from 'react';

const HelpCenterPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Centre d'Aide</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Support et Documentation</h2>
          <p className="text-muted-foreground">
            Trouvez des réponses à vos questions
          </p>
          {/* TODO: Implémenter l'interface Help Center complète */}
        </div>
      </div>
    </main>
  );
};

export default HelpCenterPage;
