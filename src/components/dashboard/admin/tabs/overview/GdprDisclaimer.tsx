
import React from 'react';

const GdprDisclaimer: React.FC = () => {
  return (
    <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-xl text-sm text-muted-foreground">
      <p>Note RGPD: Données agrégées et anonymisées. Aucune information personnellement identifiable (PII) n'est utilisée.</p>
    </div>
  );
};

export default GdprDisclaimer;
