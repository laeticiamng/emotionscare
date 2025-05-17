
import React from 'react';

interface JournalTabProps {
  className?: string;
}

const JournalTab: React.FC<JournalTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">Journal</h2>
      <p className="text-muted-foreground">Consultez et modifiez votre journal émotionnel.</p>
      
      {/* Contenu du journal à implémenter */}
      <div className="mt-4 p-4 border rounded-md">
        <p>Entrées de journal à venir...</p>
      </div>
    </div>
  );
};

export default JournalTab;
