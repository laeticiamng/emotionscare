import React, { useState } from 'react';
import { useARFilters } from '@/hooks/useARFilters';
import { useAuth } from '@/contexts/AuthContext';

interface Filter {
  name: string;
  emoji: string;
  type: string;
}

const FILTERS: Filter[] = [
  { name: 'Joyeux', emoji: '😊', type: 'joy' },
  { name: 'Calme', emoji: '😌', type: 'calm' },
  { name: 'Énergique', emoji: '⚡', type: 'energetic' },
  { name: 'Zen', emoji: '🧘', type: 'zen' },
];

interface ARFiltersMainProps {
  className?: string;
}

/**
 * Composant principal du module AR Filters
 * Filtres de réalité augmentée émotionnels
 */
export const ARFiltersMain: React.FC<ARFiltersMainProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { createSession, incrementPhotosTaken, completeSession } = useARFilters(user?.id || '');
  const [currentFilter, setCurrentFilter] = useState<Filter>(FILTERS[0]);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const applyFilter = () => {
    const randomFilter = FILTERS[Math.floor(Math.random() * FILTERS.length)];
    setCurrentFilter(randomFilter);
    setIsActive(true);
    
    if (user?.id) {
      createSession({ filterType: randomFilter.type }, {
        onSuccess: (session) => {
          setSessionId(session.id);
          setStartTime(Date.now());
        }
      });
    }
  };

  const removeFilter = () => {
    if (sessionId && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      completeSession({ sessionId, duration, moodImpact: 'positive' });
    }
    setIsActive(false);
    setSessionId(null);
    setStartTime(null);
  };

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
