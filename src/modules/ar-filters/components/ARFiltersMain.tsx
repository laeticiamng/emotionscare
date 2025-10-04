import React from 'react';
import { useARFilters } from '../hooks/useARFilters';

interface ARFiltersMainProps {
  className?: string;
}

/**
 * Composant principal du module AR Filters
 * Filtres de réalité augmentée émotionnels
 */
export const ARFiltersMain: React.FC<ARFiltersMainProps> = ({ className = '' }) => {
  const { currentFilter, isActive, applyFilter, removeFilter } = useARFilters();

  return (
    <div className={`ar-filters-container ${className}`}>
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold text-foreground">AR Filters 🪞</h2>
        
        <div className="text-center space-y-4">
          {isActive ? (
            <>
              <div className="text-4xl">{currentFilter.emoji}</div>
              <p className="text-muted-foreground">Filtre: {currentFilter.name}</p>
              <button
                onClick={removeFilter}
                className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Retirer le filtre
              </button>
            </>
          ) : (
            <button
              onClick={applyFilter}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Appliquer un filtre
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ARFiltersMain;
