import React from 'react';
import { useJournalNew } from '../hooks/useJournalNew';

interface JournalNewMainProps {
  className?: string;
}

/**
 * Composant principal du module Journal New
 * Nouvelle interface enrichie du journal émotionnel
 */
export const JournalNewMain: React.FC<JournalNewMainProps> = ({ className = '' }) => {
  const { entries, addEntry, loading } = useJournalNew();

  return (
    <div className={`journal-new-container ${className}`}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Journal Émotionnel</h2>
        
        {loading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">{entries.length} entrées</p>
            <button
              onClick={addEntry}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Nouvelle entrée
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalNewMain;
