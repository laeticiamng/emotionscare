
import React from 'react';

interface GlobalOverviewTabProps {
  className?: string;
}

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">Vue d'ensemble</h2>
      <p className="text-muted-foreground">Résumé de votre activité et de vos statistiques.</p>
      
      {/* Contenu du tableau de bord à implémenter */}
      <div className="mt-4 p-4 border rounded-md">
        <p>Contenu de la vue d'ensemble à venir...</p>
      </div>
    </div>
  );
};

export default GlobalOverviewTab;
