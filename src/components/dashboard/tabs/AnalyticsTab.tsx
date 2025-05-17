
import React from 'react';

interface AnalyticsTabProps {
  className?: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">Analytiques</h2>
      <p className="text-muted-foreground">Visualisez et analysez vos données émotionnelles.</p>
      
      {/* Contenu des analytiques à implémenter */}
      <div className="mt-4 p-4 border rounded-md">
        <p>Graphiques et statistiques à venir...</p>
      </div>
    </div>
  );
};

export default AnalyticsTab;
