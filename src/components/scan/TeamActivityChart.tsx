
import React from 'react';

const TeamActivityChart: React.FC = () => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">Activité de l'équipe</h3>
      <p className="text-sm text-muted-foreground">
        Graphique de l'activité émotionnelle de l'équipe sur la période sélectionnée.
      </p>
      <div className="h-40 bg-muted/20 rounded-md mt-4 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Données d'activité en chargement...</p>
      </div>
    </div>
  );
};

export default TeamActivityChart;
