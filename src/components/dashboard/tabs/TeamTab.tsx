// @ts-nocheck

import React from 'react';

interface TeamTabProps {
  className?: string;
}

const TeamTab: React.FC<TeamTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">Équipe</h2>
      <p className="text-muted-foreground">Visualisez et gérez les données de votre équipe.</p>
      
      {/* Contenu de l'équipe à implémenter */}
      <div className="mt-4 p-4 border rounded-md">
        <p>Tableau de bord d'équipe à venir...</p>
      </div>
    </div>
  );
};

export default TeamTab;
