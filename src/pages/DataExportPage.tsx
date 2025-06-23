
import React from 'react';

const DataExportPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Export de Données</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Exportation CSV</h2>
          <p className="text-muted-foreground">
            Exportez vos données personnelles
          </p>
          {/* TODO: Implémenter l'interface Data Export complète */}
        </div>
      </div>
    </main>
  );
};

export default DataExportPage;
